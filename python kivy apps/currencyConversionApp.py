# for http request
import urllib3
http = urllib3.PoolManager()

import json

# for kivy stuffs 
from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.uix.dropdown import DropDown

class CurrencyConversionApp(App):
    def build(self):
        main_layout = BoxLayout(orientation="vertical")

        # adding the welcome text
        welcome_label = Label(
            text = 'Welcome Guys',
            size_hint = (.1, .1),
            pos_hint = {'center_x': .5, 'center_y': .5}
        )

        main_layout.add_widget(welcome_label)

        currencies = ['NGN', 'GBP', 'USD', 'AUD', 'CAD', 'EGP']

        #converting from
        # adding the textInputs 
        convertingFrom = BoxLayout(orientation="horizontal", size_hint_y=.2)

        fromBox = BoxLayout(orientation="vertical", size_hint=(.1, 1))

        fromText = Label(
            text="From:",
            size_hint = (1, .2),
            pos_hint = {'center_x': .5, 'center_y': .5}
        )
        #dropdown
        self.defaultFrom = Button(
            text="USD",
            size_hint = (1, .8),
            pos_hint = {'center_x': .5, 'center_y': .5}
        )
        self.fromDropDown = DropDown()  

        # add currencied to dropDown
        for currency in currencies:
            btn = Button(
                text=currency,
                size_hint_y=None,
                height=25
            )

            btn.bind(on_release=lambda btn: self.fromDropDown.select(btn.text))

            self.fromDropDown.add_widget(btn)

        self.defaultFrom.bind(on_release=self.fromDropDown.open)
        
        # listen for when an item is selected
        self.fromDropDown.bind(on_select=lambda instance, x: setattr(self.defaultFrom, 'text', x))

        self.fromTextInput = TextInput(
            multiline=False,
            readonly=True,
            halign="right",
            font_size=25
        )

        fromBox.add_widget(fromText)
        fromBox.add_widget(self.defaultFrom)

        convertingFrom.add_widget(fromBox)
        convertingFrom.add_widget(self.fromTextInput)

        main_layout.add_widget(convertingFrom)



        # converting to
        # adding the textInputs 
        convertingTo = BoxLayout(orientation="horizontal", size_hint_y=.2)

        toBox = BoxLayout(orientation="vertical", size_hint=(.1, 1))

        toText = Label(
            text="To:",
            size_hint = (1, .2),
            pos_hint = {'center_x': .5, 'center_y': .5}
        )
        #dropdown
        self.defaultTo = Button(
            text="USD",
            size_hint = (1, .8),
            pos_hint = {'center_x': .5, 'center_y': .5}
        )

        self.toDropDown = DropDown()

        # add currencied to dropDown
        for currency in currencies:
            btn = Button(
                text=currency,
                size_hint_y=None,
                height=25
            )

            btn.bind(on_release=lambda btn: self.toDropDown.select(btn.text))

            self.toDropDown.add_widget(btn)

        self.defaultTo.bind(on_release=self.toDropDown.open)
        
        # listen for when an item is selected
        self.toDropDown.bind(on_select=lambda instance, x: setattr(self.defaultTo, 'text', x))

        self.toTextInput = TextInput(
            multiline=False,
            readonly=True,
            halign="right",
            font_size=25,
        )

        toBox.add_widget(toText)
        toBox.add_widget(self.defaultTo)

        convertingTo.add_widget(toBox)
        convertingTo.add_widget(self.toTextInput)

        main_layout.add_widget(convertingTo)

        # container that holds all the buttons
        buttonContainer = BoxLayout(orientation='horizontal')

        leftContainer = BoxLayout(orientation='vertical', size_hint_x=.7)
        rightContainer = BoxLayout(orientation='vertical', size_hint_x=.3)

        buttonsR = [
            ["9", "8", "7"],
            ["6", "5", "4"],
            ["3", "2", "1"], 
        ]

        for row in buttonsR:
            temp_box = BoxLayout(orientation='horizontal')

            for label in row:
                btn = Button(
                    text=label,
                    font_size=30,
                    pos_hint={'center_x': .5, 'center_y': .5}
                )

                btn.bind(on_press=self.on_button_press)

                temp_box.add_widget(btn)

            leftContainer.add_widget(temp_box)
        
        buttonContainer.add_widget(leftContainer)

        buttonL = ['0', 'AC', 'Convert']

        for label in buttonL:
            btn = Button(
                text=label,
                font_size=30,
                pos_hint={'center_x': .5, 'center_y': .5}
            )

            btn.bind(on_press=self.on_button_press)

            rightContainer.add_widget(btn)
        
        buttonContainer.add_widget(rightContainer)

        main_layout.add_widget(buttonContainer)

        return main_layout

    def on_button_press(self, instance):
        current = self.fromTextInput.text
        button_text = instance.text
        baseCurrency = self.defaultFrom.text
        targetCurrency = self.defaultTo.text        


        if button_text == "AC":
            # pushed the clear button
            self.fromTextInput.text = ""

        elif button_text == 'Convert':
            # actual conversion
            self.toTextInput.text = self.convert(current, baseCurrency, targetCurrency)

        else:
            # update interface
            self.fromTextInput.text = current + button_text

    
    def convert(self, amount, f, t):

        #API_KEY = "git_hub wont let me put an api key here"

        req = http.request('GET', f'https://v6.exchangerate-api.com/v6/{API_KEY}/pair/{f}/{t}/{amount}')

        return str(json.loads(req.data.decode('utf-8'))['conversion_result'])


if __name__ == '__main__':
    myApp = CurrencyConversionApp()
    myApp.run()
