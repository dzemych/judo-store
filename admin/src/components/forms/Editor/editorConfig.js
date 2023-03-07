import BalloonEditor from '@ckeditor/ckeditor5-editor-balloon/src/ballooneditor.js';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat.js'
import Autosave from '@ckeditor/ckeditor5-autosave/src/autosave.js'
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js'
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold.js'
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials.js'
import FontSize from '@ckeditor/ckeditor5-font/src/fontsize.js'
import Heading from '@ckeditor/ckeditor5-heading/src/heading.js'
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight.js'
import Image from '@ckeditor/ckeditor5-image/src/image.js'
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption.js'
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize.js'
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle.js'
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar.js'
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload.js'
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js'
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic.js'
import Link from '@ckeditor/ckeditor5-link/src/link.js'
import List from '@ckeditor/ckeditor5-list/src/list.js'
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed.js'
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js'
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice.js'
import TextTransformation from '@ckeditor/ckeditor5-typing/src/texttransformation.js'
import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter'
import BlockToolbar from '@ckeditor/ckeditor5-ui/src/toolbar/block/blocktoolbar';
import HeadingButtonsUI from '@ckeditor/ckeditor5-heading/src/headingbuttonsui';
import ParagraphButtonUI from '@ckeditor/ckeditor5-paragraph/src/paragraphbuttonui';


class Editor extends BalloonEditor {
}

// Plugins to include in the admin.
Editor.builtinPlugins = [
   BlockToolbar,
   HeadingButtonsUI,
   ParagraphButtonUI,
   Autoformat,
   Autosave,
   BlockQuote,
   Bold,
   Essentials,
   FontSize,
   Heading,
   Highlight,
   Image,
   ImageCaption,
   ImageResize,
   ImageStyle,
   ImageToolbar,
   ImageUpload,
   Indent,
   Italic,
   Link,
   List,
   MediaEmbed,
   Paragraph,
   PasteFromOffice,
   TextTransformation,
   SimpleUploadAdapter
]

// Editor configuration.
Editor.defaultConfig = {
   blockToolbar: [
      'paragraph', 'heading1', 'heading2', 'heading3',
      '|',
      'bulletedList', 'numberedList',
      '|',
      'blockQuote', 'uploadImage', 'mediaEmbed',
   ],
   toolbar : {
      items: [
         'heading',
         '|',
         'bold',
         'italic',
         'link',
         'bulletedList',
         'numberedList',
         '|',
         'outdent',
         'indent',
         '|',
         'imageUpload',
         'blockQuote',
         'mediaEmbed',
         'undo',
         'redo'
      ]
   },
   language: 'uk',
   image   : {
      toolbar: [
         'imageTextAlternative',
         'toggleImageCaption',
         'imageStyle:inline',
         'imageStyle:block',
         'imageStyle:side'
      ]
   },
}

export default Editor
