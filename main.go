package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"

	"gioui.org/app"
	"gioui.org/layout"
	"gioui.org/op"
	"gioui.org/text"
	"gioui.org/unit"
	"gioui.org/widget"
	"gioui.org/widget/material"
)

func main() {
	go func() {
		defer os.Exit(0)
		w := app.NewWindow(
			app.Title("计算器"),
			app.Size(unit.Dp(300), unit.Dp(450)),
		)
		calc := NewCalculator()
		calc.Run(w)
	}()
	app.Main()
}

type Calculator struct {
	display *widget.Editor
	buttons [][]widget.Clickable
	theme   *material.Theme
	window  *app.Window

	// 计算状态
	currentValue  float64
	previousValue float64
	operation     string
	shouldReset   bool
}

func NewCalculator() *Calculator {
	display := &widget.Editor{
		SingleLine: true,
		ReadOnly:   true,
		Alignment:  text.End,
	}
	display.SetText("0")

	// 创建按钮网格 5行4列
	buttons := make([][]widget.Clickable, 5)
	for i := range buttons {
		buttons[i] = make([]widget.Clickable, 4)
	}

	return &Calculator{
		display: display,
		buttons: buttons,
		theme:   material.NewTheme(),
	}
}

func (c *Calculator) Run(w *app.Window) error {
	c.window = w
	var ops op.Ops

	for {
		e := w.NextEvent()
		switch e := e.(type) {
		case app.DestroyEvent:
			return e.Err
		case app.FrameEvent:
			ops.Reset()
			gtx := app.NewContext(&ops, e)
			c.Layout(gtx)
			e.Frame(gtx.Ops)
		}
	}
}

func (c *Calculator) Layout(gtx layout.Context) layout.Dimensions {
	c.handleEvents(gtx)

	return layout.Flex{
		Axis:    layout.Vertical,
		Spacing: layout.SpaceStart,
	}.Layout(gtx,
		// 显示屏
		layout.Rigid(func(gtx layout.Context) layout.Dimensions {
			return layout.Inset{
				Top:    unit.Dp(20),
				Bottom: unit.Dp(20),
				Left:   unit.Dp(10),
				Right:  unit.Dp(10),
			}.Layout(gtx, func(gtx layout.Context) layout.Dimensions {
				editor := material.Editor(c.theme, c.display, "0")
				return editor.Layout(gtx)
			})
		}),
		// 按钮网格
		layout.Flexed(1, func(gtx layout.Context) layout.Dimensions {
			return layout.Inset{
				Top:    unit.Dp(10),
				Bottom: unit.Dp(10),
				Left:   unit.Dp(10),
				Right:  unit.Dp(10),
			}.Layout(gtx, func(gtx layout.Context) layout.Dimensions {
				return c.layoutButtons(gtx)
			})
		}),
	)
}

func (c *Calculator) layoutButtons(gtx layout.Context) layout.Dimensions {
	buttonLabels := [][]string{
		{"C", "CE", "⌫", "÷"},
		{"7", "8", "9", "×"},
		{"4", "5", "6", "-"},
		{"1", "2", "3", "+"},
		{"±", "0", ".", "="},
	}

	return layout.Flex{
		Axis: layout.Vertical,
	}.Layout(gtx,
		layout.Rigid(func(gtx layout.Context) layout.Dimensions {
			return layout.Flex{Axis: layout.Horizontal}.Layout(gtx,
				c.button(gtx, &c.buttons[0][0], buttonLabels[0][0], c.buttonStyle(buttonLabels[0][0])),
				c.button(gtx, &c.buttons[0][1], buttonLabels[0][1], c.buttonStyle(buttonLabels[0][1])),
				c.button(gtx, &c.buttons[0][2], buttonLabels[0][2], c.buttonStyle(buttonLabels[0][2])),
				c.button(gtx, &c.buttons[0][3], buttonLabels[0][3], c.buttonStyle(buttonLabels[0][3])),
			)
		}),
		layout.Rigid(func(gtx layout.Context) layout.Dimensions {
			return layout.Flex{Axis: layout.Horizontal}.Layout(gtx,
				c.button(gtx, &c.buttons[1][0], buttonLabels[1][0], "number"),
				c.button(gtx, &c.buttons[1][1], buttonLabels[1][1], "number"),
				c.button(gtx, &c.buttons[1][2], buttonLabels[1][2], "number"),
				c.button(gtx, &c.buttons[1][3], buttonLabels[1][3], c.buttonStyle(buttonLabels[1][3])),
			)
		}),
		layout.Rigid(func(gtx layout.Context) layout.Dimensions {
			return layout.Flex{Axis: layout.Horizontal}.Layout(gtx,
				c.button(gtx, &c.buttons[2][0], buttonLabels[2][0], "number"),
				c.button(gtx, &c.buttons[2][1], buttonLabels[2][1], "number"),
				c.button(gtx, &c.buttons[2][2], buttonLabels[2][2], "number"),
				c.button(gtx, &c.buttons[2][3], buttonLabels[2][3], c.buttonStyle(buttonLabels[2][3])),
			)
		}),
		layout.Rigid(func(gtx layout.Context) layout.Dimensions {
			return layout.Flex{Axis: layout.Horizontal}.Layout(gtx,
				c.button(gtx, &c.buttons[3][0], buttonLabels[3][0], "number"),
				c.button(gtx, &c.buttons[3][1], buttonLabels[3][1], "number"),
				c.button(gtx, &c.buttons[3][2], buttonLabels[3][2], "number"),
				c.button(gtx, &c.buttons[3][3], buttonLabels[3][3], c.buttonStyle(buttonLabels[3][3])),
			)
		}),
		layout.Rigid(func(gtx layout.Context) layout.Dimensions {
			return layout.Flex{Axis: layout.Horizontal}.Layout(gtx,
				c.button(gtx, &c.buttons[4][0], buttonLabels[4][0], c.buttonStyle(buttonLabels[4][0])),
				c.button(gtx, &c.buttons[4][1], buttonLabels[4][1], "number"),
				c.button(gtx, &c.buttons[4][2], buttonLabels[4][2], "number"),
				c.button(gtx, &c.buttons[4][3], buttonLabels[4][3], "operator"),
			)
		}),
	)
}

func (c *Calculator) button(gtx layout.Context, btn *widget.Clickable, label, style string) layout.FlexChild {
	return layout.Rigid(func(gtx layout.Context) layout.Dimensions {
		return layout.Inset{
			Top:    unit.Dp(5),
			Bottom: unit.Dp(5),
			Left:   unit.Dp(5),
			Right:  unit.Dp(5),
		}.Layout(gtx, func(gtx layout.Context) layout.Dimensions {
			button := material.Button(c.theme, btn, label)
			// 设置按钮样式
			if style == "operator" {
				button.Background = c.theme.Palette.ContrastBg
			}
			return button.Layout(gtx)
		})
	})
}

func (c *Calculator) buttonStyle(label string) string {
	switch label {
	case "C", "CE", "⌫":
		return "function"
	case "=", "+", "-", "×", "÷":
		return "operator"
	default:
		return "number"
	}
}

func (c *Calculator) handleEvents(gtx layout.Context) {
	buttonLabels := [][]string{
		{"C", "CE", "⌫", "÷"},
		{"7", "8", "9", "×"},
		{"4", "5", "6", "-"},
		{"1", "2", "3", "+"},
		{"±", "0", ".", "="},
	}

	for i := range c.buttons {
		for j := range c.buttons[i] {
			if c.buttons[i][j].Clicked(gtx) {
				c.handleButtonClick(buttonLabels[i][j])
			}
		}
	}
}

func (c *Calculator) handleButtonClick(label string) {
	currentText := c.display.Text()

	switch label {
	case "C": // 清除所有
		c.reset()
		c.updateDisplay("0")
	case "CE": // 清除当前输入
		c.updateDisplay("0")
		c.shouldReset = true
	case "⌫": // 退格
		if len(currentText) > 1 {
			c.updateDisplay(currentText[:len(currentText)-1])
		} else {
			c.updateDisplay("0")
		}
	case "±": // 正负号
		if currentText != "0" {
			if strings.HasPrefix(currentText, "-") {
				c.updateDisplay(currentText[1:])
			} else {
				c.updateDisplay("-" + currentText)
			}
		}
	case "=":
		c.calculate()
	case "+", "-", "×", "÷":
		if c.operation != "" {
			c.calculate()
		}
		c.previousValue = c.parseDisplay()
		c.operation = label
		c.shouldReset = true
	case ".":
		if c.shouldReset {
			c.updateDisplay("0.")
			c.shouldReset = false
		} else if !strings.Contains(currentText, ".") {
			c.updateDisplay(currentText + ".")
		}
	case "0", "1", "2", "3", "4", "5", "6", "7", "8", "9":
		if c.shouldReset || currentText == "0" {
			c.updateDisplay(label)
			c.shouldReset = false
		} else {
			c.updateDisplay(currentText + label)
		}
	}
}

func (c *Calculator) calculate() {
	current := c.parseDisplay()
	var result float64

	switch c.operation {
	case "+":
		result = c.previousValue + current
	case "-":
		result = c.previousValue - current
	case "×":
		result = c.previousValue * current
	case "÷":
		if current != 0 {
			result = c.previousValue / current
		} else {
			c.updateDisplay("错误")
			c.previousValue = 0
			c.operation = ""
			c.shouldReset = true
			return
		}
	default:
		return
	}

	c.updateDisplay(c.formatResult(result))
	c.previousValue = result
	c.operation = ""
	c.shouldReset = true
}

func (c *Calculator) parseDisplay() float64 {
	text := strings.TrimSpace(c.display.Text())
	// 如果显示"错误"，返回0
	if text == "错误" {
		return 0
	}
	val, err := strconv.ParseFloat(text, 64)
	if err != nil {
		return 0
	}
	return val
}

func (c *Calculator) formatResult(result float64) string {
	// 如果是整数，显示为整数；否则显示为小数
	if result == float64(int64(result)) {
		return fmt.Sprintf("%.0f", result)
	}
	return fmt.Sprintf("%g", result)
}

func (c *Calculator) updateDisplay(text string) {
	c.display.SetText(text)
	if c.window != nil {
		c.window.Invalidate()
	}
}

func (c *Calculator) reset() {
	c.currentValue = 0
	c.previousValue = 0
	c.operation = ""
	c.shouldReset = false
}
