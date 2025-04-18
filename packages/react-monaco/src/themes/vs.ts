import type { MonacoCompleteTheme } from '../types';

export default {
  name: 'vs',
  displayName: 'Light (Visual Studio)',
  isDark: false,
  colors: {
    primary: '#005FB8',
    secondary: '#ADD6FF80',
    success: '#369432',
    error: '#C72E0F',
    background: '#FFFFFF',
    text: '#3B3B3B',
    borderColor: '#CECECE',
  },
  data: {
    inherit: false,
    base: 'vs',
    colors: {
      'checkbox.border': '#CECECE',
      'editor.background': '#FFFFFF',
      'editor.foreground': '#3B3B3B',
      'editor.inactiveSelectionBackground': '#E5EBF1',
      'editorIndentGuide.background1': '#D3D3D3',
      'editorIndentGuide.activeBackground1': '#939393',
      'editor.selectionHighlightBackground': '#ADD6FF80',
      'editorSuggestWidget.background': '#F8F8F8',
      'activityBarBadge.background': '#005FB8',
      'sideBarTitle.foreground': '#3B3B3B',
      'list.hoverBackground': '#F2F2F2',
      'menu.border': '#CECECE',
      'input.placeholderForeground': '#767676',
      'searchEditor.textInputBorder': '#CECECE',
      'settings.textInputBorder': '#CECECE',
      'settings.numberInputBorder': '#CECECE',
      'statusBarItem.remoteForeground': '#FFFFFF',
      'statusBarItem.remoteBackground': '#005FB8',
      'ports.iconRunningProcessForeground': '#369432',
      'sideBarSectionHeader.background': '#F8F8F8',
      'sideBarSectionHeader.border': '#E5E5E5',
      'tab.selectedForeground': '#333333b3',
      'tab.selectedBackground': '#ffffffa5',
      'tab.lastPinnedBorder': '#D4D4D4',
      'notebook.cellBorderColor': '#E5E5E5',
      'notebook.selectedCellBackground': '#C8DDF150',
      'statusBarItem.errorBackground': '#C72E0F',
      'list.activeSelectionIconForeground': '#000000',
      'list.focusAndSelectionOutline': '#005FB8',
      'terminal.inactiveSelectionBackground': '#E5EBF1',
      'widget.border': '#E5E5E5',
      'actionBar.toggledBackground': '#dddddd',
      'diffEditor.unchangedRegionBackground': '#f8f8f8',
      'activityBar.activeBorder': '#005FB8',
      'activityBar.background': '#F8F8F8',
      'activityBar.border': '#E5E5E5',
      'activityBar.foreground': '#1F1F1F',
      'activityBar.inactiveForeground': '#616161',
      'activityBarBadge.foreground': '#FFFFFF',
      'badge.background': '#CCCCCC',
      'badge.foreground': '#3B3B3B',
      'button.background': '#005FB8',
      'button.border': '#0000001a',
      'button.foreground': '#FFFFFF',
      'button.hoverBackground': '#0258A8',
      'button.secondaryBackground': '#E5E5E5',
      'button.secondaryForeground': '#3B3B3B',
      'button.secondaryHoverBackground': '#CCCCCC',
      'chat.slashCommandBackground': '#D2ECFF',
      'chat.slashCommandForeground': '#306CA2',
      'chat.editedFileForeground': '#895503',
      'checkbox.background': '#F8F8F8',
      descriptionForeground: '#3B3B3B',
      'dropdown.background': '#FFFFFF',
      'dropdown.border': '#CECECE',
      'dropdown.foreground': '#3B3B3B',
      'dropdown.listBackground': '#FFFFFF',
      'editorGroup.border': '#E5E5E5',
      'editorGroupHeader.tabsBackground': '#F8F8F8',
      'editorGroupHeader.tabsBorder': '#E5E5E5',
      'editorGutter.addedBackground': '#2EA043',
      'editorGutter.deletedBackground': '#F85149',
      'editorGutter.modifiedBackground': '#005FB8',
      'editorLineNumber.activeForeground': '#171184',
      'editorLineNumber.foreground': '#6E7681',
      'editorOverviewRuler.border': '#E5E5E5',
      'editorWidget.background': '#F8F8F8',
      errorForeground: '#F85149',
      focusBorder: '#005FB8',
      foreground: '#3B3B3B',
      'icon.foreground': '#3B3B3B',
      'input.background': '#FFFFFF',
      'input.border': '#CECECE',
      'input.foreground': '#3B3B3B',
      'inputOption.activeBackground': '#BED6ED',
      'inputOption.activeBorder': '#005FB8',
      'inputOption.activeForeground': '#000000',
      'keybindingLabel.foreground': '#3B3B3B',
      'list.activeSelectionBackground': '#E8E8E8',
      'list.activeSelectionForeground': '#000000',
      'menu.selectionBackground': '#005FB8',
      'menu.selectionForeground': '#ffffff',
      'notificationCenterHeader.background': '#FFFFFF',
      'notificationCenterHeader.foreground': '#3B3B3B',
      'notifications.background': '#FFFFFF',
      'notifications.border': '#E5E5E5',
      'notifications.foreground': '#3B3B3B',
      'panel.background': '#F8F8F8',
      'panel.border': '#E5E5E5',
      'panelInput.border': '#E5E5E5',
      'panelTitle.activeBorder': '#005FB8',
      'panelTitle.activeForeground': '#3B3B3B',
      'panelTitle.inactiveForeground': '#3B3B3B',
      'peekViewEditor.matchHighlightBackground': '#BB800966',
      'peekViewResult.background': '#FFFFFF',
      'peekViewResult.matchHighlightBackground': '#BB800966',
      'pickerGroup.border': '#E5E5E5',
      'pickerGroup.foreground': '#8B949E',
      'progressBar.background': '#005FB8',
      'quickInput.background': '#F8F8F8',
      'quickInput.foreground': '#3B3B3B',
      'settings.dropdownBackground': '#FFFFFF',
      'settings.dropdownBorder': '#CECECE',
      'settings.headerForeground': '#1F1F1F',
      'settings.modifiedItemIndicator': '#BB800966',
      'sideBar.background': '#F8F8F8',
      'sideBar.border': '#E5E5E5',
      'sideBar.foreground': '#3B3B3B',
      'sideBarSectionHeader.foreground': '#3B3B3B',
      'statusBar.background': '#F8F8F8',
      'statusBar.foreground': '#3B3B3B',
      'statusBar.border': '#E5E5E5',
      'statusBarItem.hoverBackground': '#B8B8B850',
      'statusBarItem.compactHoverBackground': '#CCCCCC',
      'statusBar.debuggingBackground': '#FD716C',
      'statusBar.debuggingForeground': '#000000',
      'statusBar.focusBorder': '#005FB8',
      'statusBar.noFolderBackground': '#F8F8F8',
      'statusBarItem.focusBorder': '#005FB8',
      'statusBarItem.prominentBackground': '#6E768166',
      'tab.activeBackground': '#FFFFFF',
      'tab.activeBorder': '#F8F8F8',
      'tab.activeBorderTop': '#005FB8',
      'tab.activeForeground': '#3B3B3B',
      'tab.selectedBorderTop': '#68a3da',
      'tab.border': '#E5E5E5',
      'tab.hoverBackground': '#FFFFFF',
      'tab.inactiveBackground': '#F8F8F8',
      'tab.inactiveForeground': '#868686',
      'tab.unfocusedActiveBorder': '#F8F8F8',
      'tab.unfocusedActiveBorderTop': '#E5E5E5',
      'tab.unfocusedHoverBackground': '#F8F8F8',
      'terminalCursor.foreground': '#005FB8',
      'terminal.foreground': '#3B3B3B',
      'terminal.tab.activeBorder': '#005FB8',
      'textBlockQuote.background': '#F8F8F8',
      'textBlockQuote.border': '#E5E5E5',
      'textCodeBlock.background': '#F8F8F8',
      'textLink.activeForeground': '#005FB8',
      'textLink.foreground': '#005FB8',
      'textPreformat.foreground': '#3B3B3B',
      'textPreformat.background': '#0000001F',
      'textSeparator.foreground': '#21262D',
      'titleBar.activeBackground': '#F8F8F8',
      'titleBar.activeForeground': '#1E1E1E',
      'titleBar.border': '#E5E5E5',
      'titleBar.inactiveBackground': '#F8F8F8',
      'titleBar.inactiveForeground': '#8B949E',
      'welcomePage.tileBackground': '#F3F3F3',
    },
    rules: [
      {
        foreground: '#000000',
        token: 'meta.embedded',
      },
      {
        foreground: '#000000',
        token: 'source.groovy.embedded',
      },
      {
        foreground: '#000000',
        token: 'string meta.image.inline.markdown',
      },
      {
        foreground: '#000000',
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
        foreground: '#008000',
        token: 'comment',
      },
      {
        foreground: '#0000ff',
        token: 'constant.language',
      },
      {
        foreground: '#098658',
        token: 'constant.numeric',
      },
      {
        foreground: '#098658',
        token: 'variable.other.enummember',
      },
      {
        foreground: '#098658',
        token: 'keyword.operator.plus.exponent',
      },
      {
        foreground: '#098658',
        token: 'keyword.operator.minus.exponent',
      },
      {
        foreground: '#811f3f',
        token: 'constant.regexp',
      },
      {
        foreground: '#800000',
        token: 'entity.name.tag',
      },
      {
        foreground: '#800000',
        token: 'entity.name.selector',
      },
      {
        foreground: '#e50000',
        token: 'entity.other.attribute-name',
      },
      {
        foreground: '#800000',
        token: 'entity.other.attribute-name.class.css',
      },
      {
        foreground: '#800000',
        token: 'source.css entity.other.attribute-name.class',
      },
      {
        foreground: '#800000',
        token: 'entity.other.attribute-name.id.css',
      },
      {
        foreground: '#800000',
        token: 'entity.other.attribute-name.parent-selector.css',
      },
      {
        foreground: '#800000',
        token: 'entity.other.attribute-name.parent.less',
      },
      {
        foreground: '#800000',
        token: 'source.css entity.other.attribute-name.pseudo-class',
      },
      {
        foreground: '#800000',
        token: 'entity.other.attribute-name.pseudo-element.css',
      },
      {
        foreground: '#800000',
        token: 'source.css.less entity.other.attribute-name.id',
      },
      {
        foreground: '#800000',
        token: 'entity.other.attribute-name.scss',
      },
      {
        foreground: '#cd3131',
        token: 'invalid',
      },
      {
        fontStyle: 'underline',
        token: 'markup.underline',
      },
      {
        fontStyle: 'bold',
        foreground: '#000080',
        token: 'markup.bold',
      },
      {
        fontStyle: 'bold',
        foreground: '#800000',
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
        foreground: '#098658',
        token: 'markup.inserted',
      },
      {
        foreground: '#a31515',
        token: 'markup.deleted',
      },
      {
        foreground: '#0451a5',
        token: 'markup.changed',
      },
      {
        foreground: '#0451a5',
        token: 'punctuation.definition.quote.begin.markdown',
      },
      {
        foreground: '#0451a5',
        token: 'punctuation.definition.list.begin.markdown',
      },
      {
        foreground: '#800000',
        token: 'markup.inline.raw',
      },
      {
        foreground: '#800000',
        token: 'punctuation.definition.tag',
      },
      {
        foreground: '#0000ff',
        token: 'meta.preprocessor',
      },
      {
        foreground: '#0000ff',
        token: 'entity.name.function.preprocessor',
      },
      {
        foreground: '#a31515',
        token: 'meta.preprocessor.string',
      },
      {
        foreground: '#098658',
        token: 'meta.preprocessor.numeric',
      },
      {
        foreground: '#0451a5',
        token: 'meta.structure.dictionary.key.python',
      },
      {
        foreground: '#0000ff',
        token: 'storage',
      },
      {
        foreground: '#0000ff',
        token: 'storage.type',
      },
      {
        foreground: '#0000ff',
        token: 'storage.modifier',
      },
      {
        foreground: '#0000ff',
        token: 'keyword.operator.noexcept',
      },
      {
        foreground: '#a31515',
        token: 'string',
      },
      {
        foreground: '#a31515',
        token: 'meta.embedded.assembly',
      },
      {
        foreground: '#0000ff',
        token: 'string.comment.buffered.block.pug',
      },
      {
        foreground: '#0000ff',
        token: 'string.quoted.pug',
      },
      {
        foreground: '#0000ff',
        token: 'string.interpolated.pug',
      },
      {
        foreground: '#0000ff',
        token: 'string.unquoted.plain.in.yaml',
      },
      {
        foreground: '#0000ff',
        token: 'string.unquoted.plain.out.yaml',
      },
      {
        foreground: '#0000ff',
        token: 'string.unquoted.block.yaml',
      },
      {
        foreground: '#0000ff',
        token: 'string.quoted.single.yaml',
      },
      {
        foreground: '#0000ff',
        token: 'string.quoted.double.xml',
      },
      {
        foreground: '#0000ff',
        token: 'string.quoted.single.xml',
      },
      {
        foreground: '#0000ff',
        token: 'string.unquoted.cdata.xml',
      },
      {
        foreground: '#0000ff',
        token: 'string.quoted.double.html',
      },
      {
        foreground: '#0000ff',
        token: 'string.quoted.single.html',
      },
      {
        foreground: '#0000ff',
        token: 'string.unquoted.html',
      },
      {
        foreground: '#0000ff',
        token: 'string.quoted.single.handlebars',
      },
      {
        foreground: '#0000ff',
        token: 'string.quoted.double.handlebars',
      },
      {
        foreground: '#811f3f',
        token: 'string.regexp',
      },
      {
        foreground: '#0000ff',
        token: 'punctuation.definition.template-expression.begin',
      },
      {
        foreground: '#0000ff',
        token: 'punctuation.definition.template-expression.end',
      },
      {
        foreground: '#0000ff',
        token: 'punctuation.section.embedded',
      },
      {
        foreground: '#000000',
        token: 'meta.template.expression',
      },
      {
        foreground: '#0451a5',
        token: 'support.constant.property-value',
      },
      {
        foreground: '#0451a5',
        token: 'support.constant.font-name',
      },
      {
        foreground: '#0451a5',
        token: 'support.constant.media-type',
      },
      {
        foreground: '#0451a5',
        token: 'support.constant.media',
      },
      {
        foreground: '#0451a5',
        token: 'constant.other.color.rgb-value',
      },
      {
        foreground: '#0451a5',
        token: 'constant.other.rgb-value',
      },
      {
        foreground: '#0451a5',
        token: 'support.constant.color',
      },
      {
        foreground: '#e50000',
        token: 'support.type.vendored.property-name',
      },
      {
        foreground: '#e50000',
        token: 'support.type.property-name',
      },
      {
        foreground: '#e50000',
        token: 'source.css variable',
      },
      {
        foreground: '#e50000',
        token: 'source.coffee.embedded',
      },
      {
        foreground: '#0451a5',
        token: 'support.type.property-name.json',
      },
      {
        foreground: '#0000ff',
        token: 'keyword',
      },
      {
        foreground: '#0000ff',
        token: 'keyword.control',
      },
      {
        foreground: '#000000',
        token: 'keyword.operator',
      },
      {
        foreground: '#0000ff',
        token: 'keyword.operator.new',
      },
      {
        foreground: '#0000ff',
        token: 'keyword.operator.expression',
      },
      {
        foreground: '#0000ff',
        token: 'keyword.operator.cast',
      },
      {
        foreground: '#0000ff',
        token: 'keyword.operator.sizeof',
      },
      {
        foreground: '#0000ff',
        token: 'keyword.operator.alignof',
      },
      {
        foreground: '#0000ff',
        token: 'keyword.operator.typeid',
      },
      {
        foreground: '#0000ff',
        token: 'keyword.operator.alignas',
      },
      {
        foreground: '#0000ff',
        token: 'keyword.operator.instanceof',
      },
      {
        foreground: '#0000ff',
        token: 'keyword.operator.logical.python',
      },
      {
        foreground: '#0000ff',
        token: 'keyword.operator.wordlike',
      },
      {
        foreground: '#098658',
        token: 'keyword.other.unit',
      },
      {
        foreground: '#800000',
        token: 'punctuation.section.embedded.begin.php',
      },
      {
        foreground: '#800000',
        token: 'punctuation.section.embedded.end.php',
      },
      {
        foreground: '#0451a5',
        token: 'support.function.git-rebase',
      },
      {
        foreground: '#098658',
        token: 'constant.sha.git-rebase',
      },
      {
        foreground: '#000000',
        token: 'storage.modifier.import.java',
      },
      {
        foreground: '#000000',
        token: 'variable.language.wildcard.java',
      },
      {
        foreground: '#000000',
        token: 'storage.modifier.package.java',
      },
      {
        foreground: '#0000ff',
        token: 'variable.language',
      },
      {
        foreground: '#795E26',
        token: 'entity.name.function',
      },
      {
        foreground: '#795E26',
        token: 'support.function',
      },
      {
        foreground: '#795E26',
        token: 'support.constant.handlebars',
      },
      {
        foreground: '#795E26',
        token: 'source.powershell variable.other.member',
      },
      {
        foreground: '#795E26',
        token: 'entity.name.operator.custom-literal',
      },
      {
        foreground: '#267f99',
        token: 'support.class',
      },
      {
        foreground: '#267f99',
        token: 'support.type',
      },
      {
        foreground: '#267f99',
        token: 'entity.name.type',
      },
      {
        foreground: '#267f99',
        token: 'entity.name.namespace',
      },
      {
        foreground: '#267f99',
        token: 'entity.other.attribute',
      },
      {
        foreground: '#267f99',
        token: 'entity.name.scope-resolution',
      },
      {
        foreground: '#267f99',
        token: 'entity.name.class',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.numeric.go',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.byte.go',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.boolean.go',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.string.go',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.uintptr.go',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.error.go',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.rune.go',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.cs',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.generic.cs',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.modifier.cs',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.variable.cs',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.annotation.java',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.generic.java',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.java',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.object.array.java',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.primitive.array.java',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.primitive.java',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.token.java',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.groovy',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.annotation.groovy',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.parameters.groovy',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.generic.groovy',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.object.array.groovy',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.primitive.array.groovy',
      },
      {
        foreground: '#267f99',
        token: 'storage.type.primitive.groovy',
      },
      {
        foreground: '#267f99',
        token: 'meta.type.cast.expr',
      },
      {
        foreground: '#267f99',
        token: 'meta.type.new.expr',
      },
      {
        foreground: '#267f99',
        token: 'support.constant.math',
      },
      {
        foreground: '#267f99',
        token: 'support.constant.dom',
      },
      {
        foreground: '#267f99',
        token: 'support.constant.json',
      },
      {
        foreground: '#267f99',
        token: 'entity.other.inherited-class',
      },
      {
        foreground: '#267f99',
        token: 'punctuation.separator.namespace.ruby',
      },
      {
        foreground: '#AF00DB',
        token: 'keyword.control',
      },
      {
        foreground: '#AF00DB',
        token: 'source.cpp keyword.operator.new',
      },
      {
        foreground: '#AF00DB',
        token: 'source.cpp keyword.operator.delete',
      },
      {
        foreground: '#AF00DB',
        token: 'keyword.other.using',
      },
      {
        foreground: '#AF00DB',
        token: 'keyword.other.directive.using',
      },
      {
        foreground: '#AF00DB',
        token: 'keyword.other.operator',
      },
      {
        foreground: '#AF00DB',
        token: 'entity.name.operator',
      },
      {
        foreground: '#001080',
        token: 'variable',
      },
      {
        foreground: '#001080',
        token: 'meta.definition.variable.name',
      },
      {
        foreground: '#001080',
        token: 'support.variable',
      },
      {
        foreground: '#001080',
        token: 'entity.name.variable',
      },
      {
        foreground: '#001080',
        token: 'constant.other.placeholder',
      },
      {
        foreground: '#0070C1',
        token: 'variable.other.constant',
      },
      {
        foreground: '#0070C1',
        token: 'variable.other.enummember',
      },
      {
        foreground: '#001080',
        token: 'meta.object-literal.key',
      },
      {
        foreground: '#0451a5',
        token: 'support.constant.property-value',
      },
      {
        foreground: '#0451a5',
        token: 'support.constant.font-name',
      },
      {
        foreground: '#0451a5',
        token: 'support.constant.media-type',
      },
      {
        foreground: '#0451a5',
        token: 'support.constant.media',
      },
      {
        foreground: '#0451a5',
        token: 'constant.other.color.rgb-value',
      },
      {
        foreground: '#0451a5',
        token: 'constant.other.rgb-value',
      },
      {
        foreground: '#0451a5',
        token: 'support.constant.color',
      },
      {
        foreground: '#d16969',
        token: 'punctuation.definition.group.regexp',
      },
      {
        foreground: '#d16969',
        token: 'punctuation.definition.group.assertion.regexp',
      },
      {
        foreground: '#d16969',
        token: 'punctuation.definition.character-class.regexp',
      },
      {
        foreground: '#d16969',
        token: 'punctuation.character.set.begin.regexp',
      },
      {
        foreground: '#d16969',
        token: 'punctuation.character.set.end.regexp',
      },
      {
        foreground: '#d16969',
        token: 'keyword.operator.negation.regexp',
      },
      {
        foreground: '#d16969',
        token: 'support.other.parenthesis.regexp',
      },
      {
        foreground: '#811f3f',
        token: 'constant.character.character-class.regexp',
      },
      {
        foreground: '#811f3f',
        token: 'constant.other.character-class.set.regexp',
      },
      {
        foreground: '#811f3f',
        token: 'constant.other.character-class.regexp',
      },
      {
        foreground: '#811f3f',
        token: 'constant.character.set.regexp',
      },
      {
        foreground: '#000000',
        token: 'keyword.operator.quantifier.regexp',
      },
      {
        foreground: '#EE0000',
        token: 'keyword.operator.or.regexp',
      },
      {
        foreground: '#EE0000',
        token: 'keyword.control.anchor.regexp',
      },
      {
        foreground: '#0000ff',
        token: 'constant.character',
      },
      {
        foreground: '#0000ff',
        token: 'constant.other.option',
      },
      {
        foreground: '#EE0000',
        token: 'constant.character.escape',
      },
      {
        foreground: '#000000',
        token: 'entity.name.label',
      },
    ],
    encodedTokensColors: [],
  },
} as MonacoCompleteTheme;
