import WindowManager from 'tinymce/themes/silver/ui/dialog/WindowManager';
import KeyboardShortcutsTab from 'src/plugins/help/main/ts/ui/KeyboardShortcutsTab';
import VersionTab from 'src/plugins/help/main/ts/ui/VersionTab';
import PluginsTab from 'src/plugins/help/main/ts/ui/PluginsTab';

import { setupDemo } from '../components/DemoHelpers';

declare let tinymce: any;

export default () => {
  const helpers = setupDemo();
  const winMgr = WindowManager.setup(helpers.extras);

  tinymce.init(
    {
      selector: 'textarea.tiny-text',
      theme: 'silver',
      plugins: [
        'advlist'
      ]
    }
  ).then(function (editors) {
    const editor = editors[0];
    winMgr.open(
      {
        title: 'Help',
        size: 'large',
        body: {
          type: 'tabpanel',
          // tabs: take objects with a title and item array
          tabs: [
            // E.G.
            // {
            //   title: 'Title shown',
            //   items: [
            //     {
            //       type: 'htmlpanel',
            //       html: '<p>Html paragraph</p>'
            //     }
            //   ]
            // },
            KeyboardShortcutsTab.tab(),
            PluginsTab.tab(editor),
            VersionTab.tab()
          ]
        },
        buttons: [
          {
            type: 'submit',
            name: 'ok',
            text: 'Ok',
            primary: true
          },
          {
            type: 'cancel',
            name: 'cancel',
            text: 'Cancel'
          }
        ],
        initialData: {},
        onSubmit: (api) => {
          api.close();
        }
      }, {}, () => {});
  });

  // The end user will use this as config

};