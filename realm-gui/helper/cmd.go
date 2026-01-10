package helper

import (
	"context"
	"fmt"
	"log"
	"os"
	"path"
	"strconv"
	"strings"

	repl "github.com/openengineer/go-repl"
	gorm "gorm.io/gorm"
)

const (
	DBName       string = "realm.db"
	MainDomain   string = "main.passwd"
	SaveFileName string = "delete.txt"
	HelpMessage  string = `help                     display this message
login <string>           login with main passwd
add   <string> <string> <string>  add domain, user and passwd
count                    query how many domain
list                     list all domain, user and passwd
query <string>           query domain's passwd
genpwd                   generate new passwd
quit                     quit this program
exit                     quit this program`
)

// implements repl.Handler interface
type RealmHandler struct {
	ctx     context.Context
	db      *gorm.DB
	r       *repl.Repl
	mainPwd string
}

func RunReplCmder() {
	fmt.Println("type \"help\" for more info")
	dir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}
	// fmt.Println("dir = ", dir)
	realmdb, err := OpenDB(path.Join(dir, DBName))
	if err != nil {
		log.Fatal(err)
	}
	h := &RealmHandler{
		ctx:     context.Background(),
		db:      realmdb,
		mainPwd: "",
	}
	h.r = repl.NewRepl(h)

	// start the terminal loop
	if err := h.r.Loop(); err != nil {
		log.Fatal(err)
	}
}

func (rh *RealmHandler) Prompt() string {
	return "> "
}

func (rh *RealmHandler) Tab(buffer string) string {
	return "" // do nothing
}

func (rh *RealmHandler) Eval(line string) string {
	fields := strings.Fields(line)

	if len(fields) == 0 {
		return ""
	} else {
		cmd, args := fields[0], fields[1:]

		switch cmd {
		case "help":
			return HelpMessage
		case "login":
			if len(args) != 1 {
				return "\"login\" expects 1 args, like \"login [passwd]\""
			} else {
				return rh.login(args[0])
			}
		case "add":
			if len(args) != 3 {
				return "\"add\" expects 3 args, like \"add www.google.com [user] [passwd]\""
			} else {
				return rh.add(args[0], args[1], args[2])
			}
		case "query":
			if len(args) != 1 {
				return "\"query\" expects 1 args, like \"query www.google.com\""
			} else {
				return rh.query(args[0])
			}
		case "list":
			if len(args) != 0 {
				return "\"list\" expects 0 args, like \"list\""
			} else {
				return rh.list()
			}
		case "save":
			if len(args) != 0 {
				return "\"save\" expects 0 args, like \"save\""
			} else {
				return rh.save()
			}
		case "genpwd":
			if len(args) != 0 {
				return "\"genpwd\" expects 0 args, like \"genpwd\""
			} else {
				return rh.genpwd()
			}
		case "count":
			if len(args) != 0 {
				return "\"count\" expects 0 args, like \"count\""
			} else {
				return rh.counter()
			}
		case "exit", "quit":
			rh.quit()
			rh.r.Quit()
			return ""
		default:
			return fmt.Sprintf("unrecognized command \"%s\"", cmd)
		}
	}
}

func (rh *RealmHandler) login(mainPwd string) string {
	if IsStringBlank(mainPwd) {
		return "main passwd can not be blank."
	}
	pwddOri := QueryDomain(rh.db, MainDomain)
	pwdd, _ := GetAESEncrypted(mainPwd, mainPwd)
	// fmt.Println("MainDomain = ", MainDomain)
	// fmt.Println("pwdd = ", pwdd)
	if len(pwddOri) == 0 {
		AddDomain(rh.db, MainDomain, "", pwdd)
		rh.mainPwd = mainPwd
		return "login success. Your first set your main passwd."
	}
	if pwdd == pwddOri {
		rh.mainPwd = mainPwd
		return "login success."
	} else {
		return "login fail. Your main passwd is not right."
	}
}

func (rh *RealmHandler) add(domain string, user string, pwd string) string {
	if IsStringBlank(rh.mainPwd) {
		return "please login first."
	}
	pwdd := QueryDomain(rh.db, domain)
	pwddNew, _ := GetAESEncrypted(rh.mainPwd, pwd)
	if IsStringBlank(pwdd) {
		// create
		AddDomain(rh.db, domain, user, pwddNew)
		return fmt.Sprintf("add %s success.\n", domain)
	} else {
		// update
		UpdateDomainPasswd(rh.db, domain, user, pwddNew)
		return fmt.Sprintf("update %s success.\n", domain)
	}
}

func (rh *RealmHandler) query(domain string) string {
	pwdd := QueryDomain(rh.db, domain)
	if IsStringBlank(pwdd) {
		return fmt.Sprintf("Can not find %s's passwd.\n", domain)
	}
	pwd, _ := GetAESDecrypted(rh.mainPwd, pwdd)
	return pwd
}

func (rh *RealmHandler) counter() string {
	if IsStringBlank(rh.mainPwd) {
		return "please login first."
	}
	cnt := Counter(rh.db)
	return strconv.FormatInt(cnt, 10)
}

func (rh *RealmHandler) list() string {
	if IsStringBlank(rh.mainPwd) {
		return "please login first."
	}
	return ListAll(rh.db, rh.mainPwd)
}

func (rh *RealmHandler) save() string {
	if IsStringBlank(rh.mainPwd) {
		return "please login first."
	}
	pwdstr := ListAll(rh.db, rh.mainPwd)
	if err := os.WriteFile(SaveFileName, []byte(pwdstr), 0o666); err != nil {
		return fmt.Sprintf("Save to delete.txt success, Error is %s.\n", err)
	}
	return "Save to delete.txt Success."
}

func (rh *RealmHandler) quit() string {
	os.Remove(SaveFileName)
	return ""
}

func (rh *RealmHandler) genpwd() string {
	if IsStringBlank(rh.mainPwd) {
		return "please login first."
	}
	return MustGenerate(13, 6, 1, false, false)
}
