import { registerPlugin, registerWebPlugin, WebPlugin } from '@capacitor/core';

class CustomWebPlugins extends WebPlugin{
  constructor() {
    super({
      name: 'CustomPlugins',
      platforms: ['web', 'ios'],
    });
  }
  launchPrint(data) {
  	let printer = window.open('', '', 'height=500, width=1000'); 
  	printer.document.write(data.html);
  	printer.print();
  }
  async openWhatsapp() {
    window.open("https://wa.me/25775960696", "_blank")
  }
}

let CustomPlugins;
if(Capacitor.getPlatform() === 'android'){
	CustomPlugins = registerPlugin('CustomPlugins');
} else {
	CustomPlugins = new CustomWebPlugins();
	registerWebPlugin(CustomPlugins);
}

export default CustomPlugins;