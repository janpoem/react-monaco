import type { MonacoCustomTheme } from '../../monaco';

export default {
  name: 'atom-material-theme',
  displayName: 'Atom Material Theme',
  isDark: true,
  colors: {
    primary: '#009688',
    background: '#263238',
    text: '#d4d4d4',
  },
  data: {
    inherit: false,
    base: 'vs-dark',
    colors: {
      'activityBar.activeBorder': '#009688',
      'activityBar.background': '#20292e',
      'activityBar.foreground': '#a7b6b8',
      'scrollbar.shadow': '#263238',
      'activityBarBadge.background': '#009688',
      'diffEditor.insertedTextBackground': '#00ff001a',
      'diffEditor.removedTextBackground': '#ff00001a',
      'dropdown.background': '#20292e',
      'editor.background': '#263238',
      'editor.findMatchBackground': '#0096887a',
      'editor.foreground': '#d4d4d4',
      'editor.lineHighlightBackground': '#212b30',
      'editor.selectionBackground': '#3b4d56',
      'editorBracketMatch.background': '#354044',
      'editorBracketMatch.border': '#FF000000',
      'editorCursor.foreground': '#009688',
      'editorGroup.dropBackground': '#00968828',
      'editorGroupHeader.tabsBackground': '#232e33',
      'editorLineNumber.foreground': '#3e4b50',
      'editorOverviewRuler.findMatchForeground': '#0000ff',
      'editorWidget.background': '#232e33',
      'editorWidget.border': '#29363d',
      'editorSuggestWidget.background': '#29363d',
      'editorSuggestWidget.border': '#29363d',
      'editorSuggestWidget.foreground': '#e6f5f3',
      'editorSuggestWidget.highlightForeground': '#e6f5f3',
      'editorSuggestWidget.selectedBackground': '#009688',
      focusBorder: '#2c383d',
      'gitDecoration.conflictingResourceForeground': '#f69864',
      'gitDecoration.deletedResourceForeground': '#EF5350',
      'gitDecoration.ignoredResourceForeground': '#6a777a',
      'gitDecoration.modifiedResourceForeground': '#FFCA28',
      'gitDecoration.untrackedResourceForeground': '#8BC34A',
      'input.background': '#20292e',
      'input.foreground': '#ffffff',
      'input.placeholderForeground': '#717e82',
      'list.activeSelectionBackground': '#009688',
      'list.activeSelectionForeground': '#dff5f3',
      'list.dropBackground': '#009688',
      'list.focusBackground': '#076b61',
      'list.highlightForeground': '#eeffff',
      'list.hoverBackground': '#2c383d',
      'list.hoverForeground': '#a7b6b8',
      'list.inactiveFocusBackground': '#009688',
      'list.inactiveSelectionBackground': '#2c383d',
      'list.inactiveSelectionForeground': '#dff5f3',
      'panel.border': '#232e33',
      'panel.background': '#273237',
      'panelTitle.activeBorder': '#009688',
      'pickerGroup.border': '#009688',
      'pickerGroup.foreground': '#009688',
      'scrollbarSlider.activeBackground': '#a7b6b840',
      'scrollbarSlider.background': '#20292e7f',
      'scrollbarSlider.hoverBackground': '#20292ebf',
      'sideBar.background': '#232e33',
      'sideBar.foreground': '#a7b6b8',
      'sideBarSectionHeader.background': '#20292e',
      'sideBarSectionHeader.foreground': '#a7b6b8',
      'sideBarTitle.foreground': '#bbbbbb',
      'statusBar.background': '#232e33',
      'statusBar.foreground': '#a7b6b8',
      'tab.activeBackground': '#232e33',
      'tab.activeBorder': '#009688',
      'tab.activeForeground': '#eeffff',
      'tab.border': '#232e33',
      'tab.inactiveBackground': '#232e33',
      'tab.inactiveForeground': '#a1b0b2',
      'terminal.ansiBlack': '#313131',
      'terminal.ansiBlue': '#4fb6f7',
      'terminal.ansiBrightBlack': '#708284',
      'terminal.ansiBrightBlue': '#4fb6f7',
      'terminal.ansiBrightCyan': '#00b9cc',
      'terminal.ansiBrightGreen': '#cddc39',
      'terminal.ansiBrightMagenta': '#e23673',
      'terminal.ansiBrightRed': '#ff5d4e',
      'terminal.ansiBrightWhite': '#e6e5e5',
      'terminal.ansiBrightYellow': '#ffcb43',
      'terminal.ansiCyan': '#00b9cc',
      'terminal.ansiGreen': '#cddc39',
      'terminal.ansiMagenta': '#e23673',
      'terminal.ansiRed': '#ff5d4e',
      'terminal.ansiWhite': '#e6e5e5',
      'terminal.ansiYellow': '#ffcb43',
      'terminal.background': '#273237',
      'terminal.foreground': '#d4d4d4',
      'titleBar.activeBackground': '#222d32',
      'debugToolBar.background': '#232e33',
    },
    rules: [
      {
        foreground: '#EEFFFF',
        token: 'source',
      },
      {
        foreground: '#EEFFFF',
        token: 'punctuation.definition.dictionary',
      },
      {
        foreground: '#EEFFFF',
        token: 'punctuation.separator.dictionary.pair',
      },
      {
        foreground: '#EEFFFF',
        token: 'variable.other',
      },
      {
        foreground: '#EEFFFF',
        token: 'variable.assignment',
      },
      {
        foreground: '#EEFFFF',
        token: 'entity.name.type.instance',
      },
      {
        foreground: '#EEFFFF',
        token: 'punctuation.section.property-list.begin.bracket.curly.css',
      },
      {
        foreground: '#EEFFFF',
        token: 'punctuation.section.property-list.end.bracket.curly.css',
      },
      {
        foreground: '#EEFFFF',
        token: 'punctuation.definition.constant.css',
      },
      {
        foreground: '#EEFFFF',
        token: 'constant.other.color',
      },
      {
        foreground: '#EEFFFF',
        token: 'support.constant.color',
      },
      {
        foreground: '#EEFFFF',
        token: 'meta.property-name.css',
      },
      {
        foreground: '#EEFFFF',
        token: 'meta.property-value.css',
      },
      {
        foreground: '#EEFFFF',
        token: 'punctuation.section.function.begin.bracket.round.css',
      },
      {
        foreground: '#EEFFFF',
        token: 'punctuation.section.function.end.bracket.round.css',
      },
      {
        foreground: '#EEFFFF',
        token: 'punctuation.section.media.begin.bracket.curly.css',
      },
      {
        foreground: '#EEFFFF',
        token: 'punctuation.section.media.end.bracket.curly.css',
      },
      {
        foreground: '#EEFFFF',
        token: 'punctuation.separator.list.comma.css',
      },
      {
        foreground: '#EEFFFF',
        token: 'meta.paragraph.markdown',
      },
      {
        foreground: '#EEFFFF',
        token: 'text.html.markdown',
      },
      {
        foreground: '#EEFFFF',
        token: 'text.html.basic',
      },
      {
        foreground: '#EEFFFF',
        token: 'punctuation.definition.variable.less',
      },
      {
        foreground: '#EEFFFF',
        token: 'variable.other.object',
      },
      {
        foreground: '#EEFFFF',
        token: 'text.jade',
      },
      {
        foreground: '#EEFFFF',
        token: 'punctuation.section.property-list.begin.bracket.curly.scss',
      },
      {
        foreground: '#EEFFFF',
        token: 'punctuation.section.property-list.end.bracket.curly.scss',
      },
      {
        foreground: '#EEFFFF',
        token: 'variable.interpolation.scss',
      },
      {
        foreground: '#EEFFFF',
        token: 'punctuation.definition.bracket.curly.begin.jsdoc',
      },
      {
        foreground: '#EEFFFF',
        token: 'punctuation.definition.bracket.curly.end.jsdoc',
      },
      {
        foreground: '#EEFFFF',
        token: 'string.other.link.description.title.markdown',
      },
      {
        foreground: '#EEFFFF',
        token: 'constant.language.import-export-all.js',
      },
      {
        foreground: '#EEFFFF',
        token: 'constant.language.import-export-all.ts',
      },
      {
        foreground: '#EEFFFF',
        token: 'constant.language.import-export-all.tsx',
      },
      {
        foreground: '#EEFFFF',
        token: 'meta.parameters.js',
      },
      {
        foreground: '#EEFFFF',
        token: 'punctuation.separator.comma.js',
      },
      {
        foreground: '#89DDF3',
        token: 'punctuation',
      },
      {
        foreground: '#89DDF3',
        token: 'keyword.operator',
      },
      {
        foreground: '#89DDF3',
        token: 'meta.brace',
      },
      {
        foreground: '#89DDF3',
        token: 'support.constant',
      },
      {
        foreground: '#89DDF3',
        token: 'support.type.object.module.js',
      },
      {
        foreground: '#89DDF3',
        token: 'meta.group.regexp',
      },
      {
        foreground: '#89DDF3',
        token: 'string.regexp.js',
      },
      {
        foreground: '#89DDF3',
        token: 'source.js-ignored-vscode',
      },
      {
        foreground: '#C3E88D',
        token: 'support.type.property-name',
      },
      {
        foreground: '#C3E88D',
        token: 'string.quoted',
      },
      {
        foreground: '#C3E88D',
        token: 'meta.object-literal.key',
      },
      {
        foreground: '#C3E88D',
        token: 'source.coffee.embedded.source',
      },
      {
        foreground: '#C3E88D',
        token: 'entity.name.section.markdown',
      },
      {
        foreground: '#C3E88D',
        token: 'punctuation.definition.heading.markdown',
      },
      {
        foreground: '#C3E88D',
        token: 'string.unquoted.plain.out.yaml',
      },
      {
        foreground: '#C3E88D',
        token: 'string.template.js',
      },
      {
        foreground: '#C3E88D',
        token: 'string.interpolated.jade',
      },
      {
        foreground: '#C3E88D',
        token: 'support.type.builtin.graphql',
      },
      {
        foreground: '#F78C6A',
        token: 'constant.numeric',
      },
      {
        foreground: '#F78C6A',
        token: 'variable.parameter.function',
      },
      {
        foreground: '#F78C6A',
        token: 'keyword.other.unit',
      },
      {
        foreground: '#F07178',
        token: 'constant.language',
      },
      {
        foreground: '#F07178',
        token: 'entity.name.tag.html',
      },
      {
        foreground: '#F07178',
        token: 'entity.name.tag.structure.any.html',
      },
      {
        foreground: '#F07178',
        token: 'entity.name.tag.inline.any.html',
      },
      {
        foreground: '#F07178',
        token: 'entity.name.tag.block.any.html',
      },
      {
        foreground: '#F07178',
        token: 'constant.other.table-name.sql',
      },
      {
        foreground: '#F07178',
        token: 'constant.other.database-name.sql',
      },
      {
        foreground: '#F07178',
        token: 'entity.name.tag.xml',
      },
      {
        foreground: '#F07178',
        token: 'entity.name.tag.localname.xml',
      },
      {
        foreground: '#F07178',
        token: 'entity.name.tag.yaml',
      },
      {
        foreground: '#F07178',
        token: 'entity.name.tag.style.html',
      },
      {
        foreground: '#F07178',
        token: 'entity.name.tag.other.html',
      },
      {
        foreground: '#F07178',
        token: 'support.variable.property.js',
      },
      {
        foreground: '#F07178',
        token: 'entity.name.tag.jade',
      },
      {
        foreground: '#F07178',
        token: 'constant.name.attribute.tag.jade',
      },
      {
        foreground: '#F07178',
        token: 'entity.name.tag.js',
      },
      {
        foreground: '#F07178',
        token: 'entity.name.tag.ts',
      },
      {
        foreground: '#F07178',
        token: 'entity.name.tag.tsx',
      },
      {
        foreground: '#F07178',
        token: 'support.class.component.js',
      },
      {
        foreground: '#F07178',
        token: 'support.class.component.ts',
      },
      {
        foreground: '#F07178',
        token: 'support.class.component.tsx',
      },
      {
        foreground: '#F07178',
        token: 'support.class.component.html',
      },
      {
        fontStyle: 'italic',
        foreground: '#4f6875',
        token: 'comment',
      },
      {
        fontStyle: 'italic',
        foreground: '#4f6875',
        token: 'punctuation.definition.comment',
      },
      {
        foreground: '#C792EA',
        token: 'storage.type',
      },
      {
        foreground: '#C792EA',
        token: 'keyword.control',
      },
      {
        foreground: '#C792EA',
        token: 'keyword.other.important.css',
      },
      {
        foreground: '#C792EA',
        token: 'punctuation.definition.keyword',
      },
      {
        foreground: '#C792EA',
        token: 'punctuation.definition.directive',
      },
      {
        foreground: '#C792EA',
        token: 'storage.modifier.cs',
      },
      {
        foreground: '#C792EA',
        token: 'keyword.other.class.cs',
      },
      {
        foreground: '#C792EA',
        token: 'keyword.type.cs',
      },
      {
        foreground: '#C792EA',
        token: 'markup.italic.markdown',
      },
      {
        foreground: '#C792EA',
        token: 'punctuation.definition.italic.markdown',
      },
      {
        foreground: '#C792EA',
        token: 'keyword.package.go',
      },
      {
        foreground: '#C792EA',
        token: 'keyword.import.go',
      },
      {
        foreground: '#C792EA',
        token: 'keyword.function.go',
      },
      {
        foreground: '#C792EA',
        token: 'keyword.var.go',
      },
      {
        foreground: '#C792EA',
        token: 'keyword.const.go',
      },
      {
        foreground: '#C792EA',
        token: 'meta.tag.sgml.doctype.html',
      },
      {
        foreground: '#C792EA',
        token: 'storage.modifier.java',
      },
      {
        foreground: '#C792EA',
        token: 'punctuation.definition.storage.type.objc',
      },
      {
        foreground: '#C792EA',
        token: 'storage.modifier.perl',
      },
      {
        foreground: '#C792EA',
        token: 'keyword.other.DML.sql',
      },
      {
        foreground: '#C792EA',
        token: 'keyword.other.alias.sql',
      },
      {
        foreground: '#C792EA',
        token: 'storage.modifier.async.js',
      },
      {
        foreground: '#C792EA',
        token: 'support.type.property-name.json',
      },
      {
        foreground: '#C792EA',
        token: 'punctuation.support.type.property-name.begin.json',
      },
      {
        foreground: '#C792EA',
        token: 'punctuation.support.type.property-name.end.json',
      },
      {
        foreground: '#C792EA',
        token: 'keyword.other.definition.ini',
      },
      {
        foreground: '#C792EA',
        token: 'punctuation.definition.block.tag.jsdoc',
      },
      {
        foreground: '#C792EA',
        token: 'storage.modifier.js',
      },
      {
        foreground: '#C792EA',
        token: 'storage.modifier.ts',
      },
      {
        foreground: '#C792EA',
        token: 'storage.modifier.tsx',
      },
      {
        foreground: '#C792EA',
        token: 'keyword.type.graphql',
      },
      {
        foreground: '#C792EA',
        token: 'keyword.other.default',
      },
      {
        fontStyle: 'italic',
        foreground: '#C792EA',
        token: 'markup.italic.markdown',
      },
      {
        fontStyle: 'italic',
        foreground: '#C792EA',
        token: 'punctuation.definition.italic.markdown',
      },
      {
        foreground: '#82AAFF',
        token: 'entity.name.function',
      },
      {
        foreground: '#82AAFF',
        token: 'support.function',
      },
      {
        foreground: '#82AAFF',
        token: 'variable.other.property',
      },
      {
        foreground: '#82AAFF',
        token: 'punctuation.definition.string.begin.markdown',
      },
      {
        foreground: '#82AAFF',
        token: 'punctuation.definition.string.end.markdown',
      },
      {
        foreground: '#82AAFF',
        token: 'markup.quote.markdown',
      },
      {
        foreground: '#82AAFF',
        token: 'meta.function-call.generic.python',
      },
      {
        foreground: '#82AAFF',
        token: 'keyword.other.special-method.ruby',
      },
      {
        foreground: '#82AAFF',
        token: 'entity.name.type.js',
      },
      {
        foreground: '#82AAFF',
        token: 'variable.other.object.property.js',
      },
      {
        foreground: '#82AAFF',
        token: 'entity.name.section.group-title.ini',
      },
      {
        foreground: '#82AAFF',
        token: 'support.variable.property.dom.js',
      },
      {
        foreground: '#82AAFF',
        token: 'support.variable.property.dom.ts',
      },
      {
        foreground: '#82AAFF',
        token: 'entity.name.type.ts',
      },
      {
        foreground: '#82AAFF',
        token: 'entity.name.type.tsx',
      },
      {
        foreground: '#82AAFF',
        token: 'variable.graphql',
      },
      {
        fontStyle: 'italic',
        foreground: '#82AAFF',
        token: 'markup.quote.markdown',
      },
      {
        foreground: '#FFCB6B',
        token: 'support.class',
      },
      {
        foreground: '#FFCB6B',
        token: 'entity.name.type.class',
      },
      {
        foreground: '#FFCB6B',
        token: 'constant.numeric.css',
      },
      {
        foreground: '#FFCB6B',
        token: 'entity.other.attribute-name',
      },
      {
        foreground: '#FFCB6B',
        token: 'support.variable.object.node.js',
      },
      {
        foreground: '#FFCB6B',
        token: 'support.variable.object.process.js',
      },
      {
        foreground: '#FFCB6B',
        token: 'support.variable.property.process.js',
      },
      {
        foreground: '#FFCB6B',
        token: 'support.variable.dom.js',
      },
      {
        foreground: '#FFCB6B',
        token: 'support.constant.json.js',
      },
      {
        foreground: '#FFCB6B',
        token: 'entity.other.inherited-class',
      },
      {
        foreground: '#FFCB6B',
        token: 'support.variable.dom.ts',
      },
      {
        foreground: '#FFCB6B',
        token: 'support.type.primitive.ts',
      },
      {
        foreground: '#FFCB6B',
        token: 'entity.name.type.interface.ts',
      },
      {
        foreground: '#FFCB6B',
        token: 'entity.name.type.module.js',
      },
      {
        foreground: '#FFCB6B',
        token: 'entity.name.type.module.ts',
      },
      {
        foreground: '#FFCB6B',
        token: 'entity.name.type.module.tsx',
      },
      {
        foreground: '#FFCB6B',
        token: 'support.variable.dom.tsx',
      },
      {
        foreground: '#FFCB6B',
        token: 'support.type.graphql',
      },
      {
        fontStyle: 'bold',
        foreground: '#FFCB6B',
        token: 'markup.bold.markdown',
      },
      {
        fontStyle: 'bold',
        foreground: '#FFCB6B',
        token: 'punctuation.definition.bold.markdown',
      },
      {
        foreground: '#FF5370',
        token: 'variable.language.super',
      },
      {
        foreground: '#FF5370',
        token: 'punctuation.definition.metadata.markdown',
      },
      {
        foreground: '#FF5370',
        token: 'variable.language.special.self.python',
      },
      {
        foreground: '#FF5370',
        token: 'punctuation.definition.interpolation.begin.bracket.curly.scss',
      },
      {
        foreground: '#FF5370',
        token: 'punctuation.definition.interpolation.end.bracket.curly.scss',
      },
      {
        foreground: '#FF5370',
        token: 'variable.language.this.js',
      },
      {
        foreground: '#FF5370',
        token: 'variable.language.this.ts',
      },
      {
        foreground: '#B2CCD6',
        token: 'entity.name.tag',
      },
      {
        foreground: '#73d1c8',
        token: 'support.type.property-name.css',
      },
      {
        foreground: '#73d1c8',
        token: 'support.type.property-name.media.css',
      },
      {
        foreground: '#73d1c8',
        token: 'support.constant.parity.css',
      },
      {
        foreground: '#73d1c8',
        token: 'meta.object-literal.key.js',
      },
      {
        foreground: '#73d1c8',
        token: 'meta.object-literal.key.ts',
      },
      {
        foreground: '#ff869a',
        token: 'markup.underline.link.image.markdown',
      },
      {
        foreground: '#ff869a',
        token: 'markup.underline.link.markdown',
      },
    ],
    encodedTokensColors: [],
  },
} as MonacoCustomTheme;
