import type { MonacoCustomTheme } from '../types';

export default {
  name: 'hc-black',
  displayName: 'Dark High Contrast',
  isDark: true,
  colors: {
    success: '#FFFFFF',
    background: '#000000',
    text: '#FFFFFF',
  },
  data: {
    inherit: false,
    base: 'hc-black',
    colors: {
      'editor.background': '#000000',
      'editor.foreground': '#FFFFFF',
      'editorIndentGuide.background1': '#FFFFFF',
      'editorIndentGuide.activeBackground1': '#FFFFFF',
      'sideBarTitle.foreground': '#FFFFFF',
      'selection.background': '#008000',
      'editor.selectionBackground': '#FFFFFF',
      'statusBarItem.remoteBackground': '#00000000',
      'ports.iconRunningProcessForeground': '#FFFFFF',
      'editorWhitespace.foreground': '#7c7c7c',
      'actionBar.toggledBackground': '#383a49',
    },
    rules: [
      {
        foreground: '#FFFFFF',
        token: 'meta.embedded',
      },
      {
        foreground: '#FFFFFF',
        token: 'source.groovy.embedded',
      },
      {
        foreground: '#FFFFFF',
        token: 'string meta.image.inline.markdown',
      },
      {
        foreground: '#FFFFFF',
        token: 'variable.legacy.builtin.python',
      },
      {
        fontStyle: 'italic',
        token: 'emphasis',
      },
      {
        fontStyle: 'bold',
        token: 'strong',
      },
      {
        foreground: '#000080',
        token: 'meta.diff.header',
      },
      {
        foreground: '#7ca668',
        token: 'comment',
      },
      {
        foreground: '#569cd6',
        token: 'constant.language',
      },
      {
        foreground: '#b5cea8',
        token: 'constant.numeric',
      },
      {
        foreground: '#b5cea8',
        token: 'constant.other.color.rgb-value',
      },
      {
        foreground: '#b5cea8',
        token: 'constant.other.rgb-value',
      },
      {
        foreground: '#b5cea8',
        token: 'support.constant.color',
      },
      {
        foreground: '#b46695',
        token: 'constant.regexp',
      },
      {
        foreground: '#569cd6',
        token: 'constant.character',
      },
      {
        foreground: '#569cd6',
        token: 'entity.name.tag',
      },
      {
        foreground: '#d7ba7d',
        token: 'entity.name.tag.css',
      },
      {
        foreground: '#d7ba7d',
        token: 'entity.name.tag.less',
      },
      {
        foreground: '#9cdcfe',
        token: 'entity.other.attribute-name',
      },
      {
        foreground: '#d7ba7d',
        token: 'entity.other.attribute-name.class.css',
      },
      {
        foreground: '#d7ba7d',
        token: 'source.css entity.other.attribute-name.class',
      },
      {
        foreground: '#d7ba7d',
        token: 'entity.other.attribute-name.id.css',
      },
      {
        foreground: '#d7ba7d',
        token: 'entity.other.attribute-name.parent-selector.css',
      },
      {
        foreground: '#d7ba7d',
        token: 'entity.other.attribute-name.parent.less',
      },
      {
        foreground: '#d7ba7d',
        token: 'source.css entity.other.attribute-name.pseudo-class',
      },
      {
        foreground: '#d7ba7d',
        token: 'entity.other.attribute-name.pseudo-element.css',
      },
      {
        foreground: '#d7ba7d',
        token: 'source.css.less entity.other.attribute-name.id',
      },
      {
        foreground: '#d7ba7d',
        token: 'entity.other.attribute-name.scss',
      },
      {
        foreground: '#f44747',
        token: 'invalid',
      },
      {
        fontStyle: 'underline',
        token: 'markup.underline',
      },
      {
        fontStyle: 'bold',
        token: 'markup.bold',
      },
      {
        fontStyle: 'bold',
        foreground: '#6796e6',
        token: 'markup.heading',
      },
      {
        fontStyle: 'italic',
        token: 'markup.italic',
      },
      {
        fontStyle: 'strikethrough',
        token: 'markup.strikethrough',
      },
      {
        foreground: '#b5cea8',
        token: 'markup.inserted',
      },
      {
        foreground: '#ce9178',
        token: 'markup.deleted',
      },
      {
        foreground: '#569cd6',
        token: 'markup.changed',
      },
      {
        foreground: '#808080',
        token: 'punctuation.definition.tag',
      },
      {
        foreground: '#569cd6',
        token: 'meta.preprocessor',
      },
      {
        foreground: '#ce9178',
        token: 'meta.preprocessor.string',
      },
      {
        foreground: '#b5cea8',
        token: 'meta.preprocessor.numeric',
      },
      {
        foreground: '#9cdcfe',
        token: 'meta.structure.dictionary.key.python',
      },
      {
        foreground: '#569cd6',
        token: 'storage',
      },
      {
        foreground: '#569cd6',
        token: 'storage.type',
      },
      {
        foreground: '#569cd6',
        token: 'storage.modifier',
      },
      {
        foreground: '#ce9178',
        token: 'string',
      },
      {
        foreground: '#ce9178',
        token: 'string.tag',
      },
      {
        foreground: '#ce9178',
        token: 'string.value',
      },
      {
        foreground: '#d16969',
        token: 'string.regexp',
      },
      {
        foreground: '#569cd6',
        token: 'punctuation.definition.template-expression.begin',
      },
      {
        foreground: '#569cd6',
        token: 'punctuation.definition.template-expression.end',
      },
      {
        foreground: '#569cd6',
        token: 'punctuation.section.embedded',
      },
      {
        foreground: '#ffffff',
        token: 'meta.template.expression',
      },
      {
        foreground: '#d4d4d4',
        token: 'support.type.vendored.property-name',
      },
      {
        foreground: '#d4d4d4',
        token: 'support.type.property-name',
      },
      {
        foreground: '#d4d4d4',
        token: 'source.css variable',
      },
      {
        foreground: '#d4d4d4',
        token: 'source.coffee.embedded',
      },
      {
        foreground: '#569cd6',
        token: 'keyword',
      },
      {
        foreground: '#569cd6',
        token: 'keyword.control',
      },
      {
        foreground: '#d4d4d4',
        token: 'keyword.operator',
      },
      {
        foreground: '#569cd6',
        token: 'keyword.operator.new',
      },
      {
        foreground: '#569cd6',
        token: 'keyword.operator.expression',
      },
      {
        foreground: '#569cd6',
        token: 'keyword.operator.cast',
      },
      {
        foreground: '#569cd6',
        token: 'keyword.operator.sizeof',
      },
      {
        foreground: '#569cd6',
        token: 'keyword.operator.logical.python',
      },
      {
        foreground: '#b5cea8',
        token: 'keyword.other.unit',
      },
      {
        foreground: '#d4d4d4',
        token: 'support.function.git-rebase',
      },
      {
        foreground: '#b5cea8',
        token: 'constant.sha.git-rebase',
      },
      {
        foreground: '#d4d4d4',
        token: 'storage.modifier.import.java',
      },
      {
        foreground: '#d4d4d4',
        token: 'variable.language.wildcard.java',
      },
      {
        foreground: '#d4d4d4',
        token: 'storage.modifier.package.java',
      },
      {
        foreground: '#569cd6',
        token: 'variable.language.this',
      },
      {
        foreground: '#DCDCAA',
        token: 'entity.name.function',
      },
      {
        foreground: '#DCDCAA',
        token: 'support.function',
      },
      {
        foreground: '#DCDCAA',
        token: 'support.constant.handlebars',
      },
      {
        foreground: '#DCDCAA',
        token: 'source.powershell variable.other.member',
      },
      {
        foreground: '#4EC9B0',
        token: 'support.class',
      },
      {
        foreground: '#4EC9B0',
        token: 'support.type',
      },
      {
        foreground: '#4EC9B0',
        token: 'entity.name.type',
      },
      {
        foreground: '#4EC9B0',
        token: 'entity.name.namespace',
      },
      {
        foreground: '#4EC9B0',
        token: 'entity.name.scope-resolution',
      },
      {
        foreground: '#4EC9B0',
        token: 'entity.name.class',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.cs',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.generic.cs',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.modifier.cs',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.variable.cs',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.annotation.java',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.generic.java',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.java',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.object.array.java',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.primitive.array.java',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.primitive.java',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.token.java',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.groovy',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.annotation.groovy',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.parameters.groovy',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.generic.groovy',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.object.array.groovy',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.primitive.array.groovy',
      },
      {
        foreground: '#4EC9B0',
        token: 'storage.type.primitive.groovy',
      },
      {
        foreground: '#4EC9B0',
        token: 'meta.type.cast.expr',
      },
      {
        foreground: '#4EC9B0',
        token: 'meta.type.new.expr',
      },
      {
        foreground: '#4EC9B0',
        token: 'support.constant.math',
      },
      {
        foreground: '#4EC9B0',
        token: 'support.constant.dom',
      },
      {
        foreground: '#4EC9B0',
        token: 'support.constant.json',
      },
      {
        foreground: '#4EC9B0',
        token: 'entity.other.inherited-class',
      },
      {
        foreground: '#4EC9B0',
        token: 'punctuation.separator.namespace.ruby',
      },
      {
        foreground: '#C586C0',
        token: 'keyword.control',
      },
      {
        foreground: '#C586C0',
        token: 'source.cpp keyword.operator.new',
      },
      {
        foreground: '#C586C0',
        token: 'source.cpp keyword.operator.delete',
      },
      {
        foreground: '#C586C0',
        token: 'keyword.other.using',
      },
      {
        foreground: '#C586C0',
        token: 'keyword.other.directive.using',
      },
      {
        foreground: '#C586C0',
        token: 'keyword.other.operator',
      },
      {
        foreground: '#9CDCFE',
        token: 'variable',
      },
      {
        foreground: '#9CDCFE',
        token: 'meta.definition.variable.name',
      },
      {
        foreground: '#9CDCFE',
        token: 'support.variable',
      },
      {
        foreground: '#9CDCFE',
        token: 'meta.object-literal.key',
      },
      {
        foreground: '#CE9178',
        token: 'support.constant.property-value',
      },
      {
        foreground: '#CE9178',
        token: 'support.constant.font-name',
      },
      {
        foreground: '#CE9178',
        token: 'support.constant.media-type',
      },
      {
        foreground: '#CE9178',
        token: 'support.constant.media',
      },
      {
        foreground: '#CE9178',
        token: 'constant.other.color.rgb-value',
      },
      {
        foreground: '#CE9178',
        token: 'constant.other.rgb-value',
      },
      {
        foreground: '#CE9178',
        token: 'support.constant.color',
      },
      {
        foreground: '#CBEDCB',
        token: 'meta.resultLinePrefix.contextLinePrefix.search',
      },
    ],
    encodedTokensColors: [],
  },
} as MonacoCustomTheme;
