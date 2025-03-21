/******************************************************************************
 * - ref: https://biomejs.dev/
 * - ref: https://www.npmjs.com/package/@biomejs/wasm-web
 ******************************************************************************
 * MIT License
 *
 * Copyright (c) 2023 Biome Developers and Contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 ******************************************************************************/

/* tslint:disable */
/* eslint-disable */
/**
 */
export function main(): void;
interface SupportsFeatureParams {
  features: FeatureName;
  path: BiomePath;
}
type FeatureName = FeatureKind[];
interface BiomePath {
  /**
   * Determines the kind of the file inside Biome. Some files are considered as configuration files, others as manifest files, and others as files to handle
   */
  kind: FileKind;
  /**
   * The path to the file
   */
  path: string;
  /**
   * Whether this path (usually a file) was fixed as a result of a format/lint/check command with the `--write` filag.
   */
  was_written: boolean;
}
export type FeatureKind =
  | 'Format'
  | 'Lint'
  | 'OrganizeImports'
  | 'Search'
  | 'Assists'
  | 'Debug';
export type FileKind = FileKind2[];
export type FileKind2 =
  | 'Config'
  | 'Manifest'
  | 'Ignore'
  | 'Inspectable'
  | 'Handleable';
interface FileFeaturesResult {
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  features_supported: {};
}
interface UpdateSettingsParams {
  // add by janpoem
  projectKey: ProjectKey;
  configuration: PartialConfiguration;
  gitignore_matches: string[];
  vcs_base_path?: string;
  // ? or workspaceDirectory? @janpoem
  workspace_directory?: string;
}
interface PartialConfiguration {
  /**
   * A field for the [JSON schema](https://json-schema.org/) specification
   */
  $schema?: string;
  /**
   * Specific configuration for assists
   */
  assists?: PartialAssistsConfiguration;
  /**
   * Specific configuration for the Css language
   */
  css?: PartialCssConfiguration;
  /**
   * A list of paths to other JSON files, used to extends the current configuration.
   */
  extends?: StringSet;
  /**
   * The configuration of the filesystem
   */
  files?: PartialFilesConfiguration;
  /**
   * The configuration of the formatter
   */
  formatter?: PartialFormatterConfiguration;
  /**
   * Specific configuration for the GraphQL language
   */
  graphql?: PartialGraphqlConfiguration;
  /**
   * Specific configuration for the JavaScript language
   */
  javascript?: PartialJavascriptConfiguration;
  /**
   * Specific configuration for the Json language
   */
  json?: PartialJsonConfiguration;
  /**
   * The configuration for the linter
   */
  linter?: PartialLinterConfiguration;
  /**
   * The configuration of the import sorting
   */
  organizeImports?: PartialOrganizeImports;
  /**
   * A list of granular patterns that should be applied only to a sub set of files
   */
  overrides?: Overrides;
  /**
   * The configuration of the VCS integration
   */
  vcs?: PartialVcsConfiguration;
}
interface PartialAssistsConfiguration {
  /**
   * Whether Biome should fail in CLI if the assists were not applied to the code.
   */
  actions?: Actions;
  /**
   * Whether Biome should enable assists via LSP.
   */
  enabled?: boolean;
  /**
   * A list of Unix shell style patterns. The formatter will ignore files/folders that will match these patterns.
   */
  ignore?: StringSet;
  /**
   * A list of Unix shell style patterns. The formatter will include files/folders that will match these patterns.
   */
  include?: StringSet;
}
interface PartialCssConfiguration {
  /**
   * CSS assists options
   */
  assists?: PartialCssAssists;
  /**
   * CSS formatter options
   */
  formatter?: PartialCssFormatter;
  /**
   * CSS linter options
   */
  linter?: PartialCssLinter;
  /**
   * CSS parsing options
   */
  parser?: PartialCssParser;
}
type StringSet = string[];
interface PartialFilesConfiguration {
  /**
   * A list of Unix shell style patterns. Biome will ignore files/folders that will match these patterns.
   */
  ignore?: StringSet;
  /**
   * Tells Biome to not emit diagnostics when handling files that doesn't know
   */
  ignoreUnknown?: boolean;
  /**
   * A list of Unix shell style patterns. Biome will handle only those files/folders that will match these patterns.
   */
  include?: StringSet;
  /**
   * The maximum allowed size for source code files in bytes. Files above this limit will be ignored for performance reasons. Defaults to 1 MiB
   */
  maxSize?: number;
}
interface PartialFormatterConfiguration {
  /**
   * The attribute position style in HTMLish languages. By default auto.
   */
  attributePosition?: AttributePosition;
  /**
   * Whether to insert spaces around brackets in object literals. Defaults to true.
   */
  bracketSpacing?: BracketSpacing;
  enabled?: boolean;
  /**
   * Stores whether formatting should be allowed to proceed if a given file has syntax errors
   */
  formatWithErrors?: boolean;
  /**
   * A list of Unix shell style patterns. The formatter will ignore files/folders that will match these patterns.
   */
  ignore?: StringSet;
  /**
   * A list of Unix shell style patterns. The formatter will include files/folders that will match these patterns.
   */
  include?: StringSet;
  /**
   * The size of the indentation, 2 by default (deprecated, use `indent-width`)
   */
  indentSize?: IndentWidth;
  /**
   * The indent style.
   */
  indentStyle?: IndentStyle;
  /**
   * The size of the indentation, 2 by default
   */
  indentWidth?: IndentWidth;
  /**
   * The type of line ending.
   */
  lineEnding?: LineEnding;
  /**
   * What's the max width of a line. Defaults to 80.
   */
  lineWidth?: LineWidth;
  /**
   * Use any `.editorconfig` files to configure the formatter. Configuration in `biome.json` will override `.editorconfig` configuration. Default: false.
   */
  useEditorconfig?: boolean;
}
interface PartialGraphqlConfiguration {
  /**
   * GraphQL formatter options
   */
  formatter?: PartialGraphqlFormatter;
  linter?: PartialGraphqlLinter;
}
interface PartialJavascriptConfiguration {
  /**
   * Assists options
   */
  assists?: PartialJavascriptAssists;
  /**
   * Formatting options
   */
  formatter?: PartialJavascriptFormatter;
  /**
   * A list of global bindings that should be ignored by the analyzers

   If defined here, they should not emit diagnostics.
   */
  globals?: StringSet;
  /**
   * Indicates the type of runtime or transformation used for interpreting JSX.
   */
  jsxRuntime?: JsxRuntime;
  /**
   * Linter options
   */
  linter?: PartialJavascriptLinter;
  organizeImports?: PartialJavascriptOrganizeImports;
  /**
   * Parsing options
   */
  parser?: PartialJavascriptParser;
}
interface PartialJsonConfiguration {
  /**
   * Assists options
   */
  assists?: PartialJsonAssists;
  /**
   * Formatting options
   */
  formatter?: PartialJsonFormatter;
  /**
   * Linting options
   */
  linter?: PartialJsonLinter;
  /**
   * Parsing options
   */
  parser?: PartialJsonParser;
}
interface PartialLinterConfiguration {
  /**
   * if `false`, it disables the feature and the linter won't be executed. `true` by default
   */
  enabled?: boolean;
  /**
   * A list of Unix shell style patterns. The formatter will ignore files/folders that will match these patterns.
   */
  ignore?: StringSet;
  /**
   * A list of Unix shell style patterns. The formatter will include files/folders that will match these patterns.
   */
  include?: StringSet;
  /**
   * List of rules
   */
  rules?: Rules;
}
interface PartialOrganizeImports {
  /**
   * Enables the organization of imports
   */
  enabled?: boolean;
  /**
   * A list of Unix shell style patterns. The formatter will ignore files/folders that will match these patterns.
   */
  ignore?: StringSet;
  /**
   * A list of Unix shell style patterns. The formatter will include files/folders that will match these patterns.
   */
  include?: StringSet;
}
type Overrides = OverridePattern[];
interface PartialVcsConfiguration {
  /**
   * The kind of client.
   */
  clientKind?: VcsClientKind;
  /**
   * The main branch of the project
   */
  defaultBranch?: string;
  /**
   * Whether Biome should integrate itself with the VCS client
   */
  enabled?: boolean;
  /**
   * The folder where Biome should check for VCS files. By default, Biome will use the same folder where `biome.json` was found.

   If Biome can't find the configuration, it will attempt to use the current working directory. If no current working directory can't be found, Biome won't use the VCS integration, and a diagnostic will be emitted
   */
  root?: string;
  /**
   * Whether Biome should use the VCS ignore file. When [true], Biome will ignore the files specified in the ignore file.
   */
  useIgnoreFile?: boolean;
}
interface Actions {
  source?: Source;
}
interface PartialCssAssists {
  /**
   * Control the assists for CSS files.
   */
  enabled?: boolean;
}
interface PartialCssFormatter {
  /**
   * Control the formatter for CSS (and its super languages) files.
   */
  enabled?: boolean;
  /**
   * The indent style applied to CSS (and its super languages) files.
   */
  indentStyle?: IndentStyle;
  /**
   * The size of the indentation applied to CSS (and its super languages) files. Default to 2.
   */
  indentWidth?: IndentWidth;
  /**
   * The type of line ending applied to CSS (and its super languages) files.
   */
  lineEnding?: LineEnding;
  /**
   * What's the max width of a line applied to CSS (and its super languages) files. Defaults to 80.
   */
  lineWidth?: LineWidth;
  /**
   * The type of quotes used in CSS code. Defaults to double.
   */
  quoteStyle?: QuoteStyle;
}
interface PartialCssLinter {
  /**
   * Control the linter for CSS files.
   */
  enabled?: boolean;
}
interface PartialCssParser {
  /**
   * Allow comments to appear on incorrect lines in `.css` files
   */
  allowWrongLineComments?: boolean;
  /**
   * Enables parsing of CSS Modules specific features.
   */
  cssModules?: boolean;
}
type AttributePosition = 'auto' | 'multiline';
type BracketSpacing = boolean;
type IndentWidth = number;
type IndentStyle = 'tab' | 'space';
type LineEnding = 'lf' | 'crlf' | 'cr';
type LineWidth = number;
interface PartialGraphqlFormatter {
  /**
   * Whether to insert spaces around brackets in object literals. Defaults to true.
   */
  bracketSpacing?: BracketSpacing;
  /**
   * Control the formatter for GraphQL files.
   */
  enabled?: boolean;
  /**
   * The indent style applied to GraphQL files.
   */
  indentStyle?: IndentStyle;
  /**
   * The size of the indentation applied to GraphQL files. Default to 2.
   */
  indentWidth?: IndentWidth;
  /**
   * The type of line ending applied to GraphQL files.
   */
  lineEnding?: LineEnding;
  /**
   * What's the max width of a line applied to GraphQL files. Defaults to 80.
   */
  lineWidth?: LineWidth;
  /**
   * The type of quotes used in GraphQL code. Defaults to double.
   */
  quoteStyle?: QuoteStyle;
}
interface PartialGraphqlLinter {
  /**
   * Control the formatter for GraphQL files.
   */
  enabled?: boolean;
}
interface PartialJavascriptAssists {
  /**
   * Control the linter for JavaScript (and its super languages) files.
   */
  enabled?: boolean;
}
interface PartialJavascriptFormatter {
  /**
   * Whether to add non-necessary parentheses to arrow functions. Defaults to "always".
   */
  arrowParentheses?: ArrowParentheses;
  /**
   * The attribute position style in jsx elements. Defaults to auto.
   */
  attributePosition?: AttributePosition;
  /**
   * Whether to hug the closing bracket of multiline HTML/JSX tags to the end of the last line, rather than being alone on the following line. Defaults to false.
   */
  bracketSameLine?: boolean;
  /**
   * Whether to insert spaces around brackets in object literals. Defaults to true.
   */
  bracketSpacing?: BracketSpacing;
  /**
   * Control the formatter for JavaScript (and its super languages) files.
   */
  enabled?: boolean;
  /**
   * The size of the indentation applied to JavaScript (and its super languages) files. Default to 2.
   */
  indentSize?: IndentWidth;
  /**
   * The indent style applied to JavaScript (and its super languages) files.
   */
  indentStyle?: IndentStyle;
  /**
   * The size of the indentation applied to JavaScript (and its super languages) files. Default to 2.
   */
  indentWidth?: IndentWidth;
  /**
   * The type of quotes used in JSX. Defaults to double.
   */
  jsxQuoteStyle?: QuoteStyle;
  /**
   * The type of line ending applied to JavaScript (and its super languages) files.
   */
  lineEnding?: LineEnding;
  /**
   * What's the max width of a line applied to JavaScript (and its super languages) files. Defaults to 80.
   */
  lineWidth?: LineWidth;
  /**
   * When properties in objects are quoted. Defaults to asNeeded.
   */
  quoteProperties?: QuoteProperties;
  /**
   * The type of quotes used in JavaScript code. Defaults to double.
   */
  quoteStyle?: QuoteStyle;
  /**
   * Whether the formatter prints semicolons for all statements or only in for statements where it is necessary because of ASI.
   */
  semicolons?: Semicolons;
  /**
   * Print trailing commas wherever possible in multi-line comma-separated syntactic structures. Defaults to "all".
   */
  trailingComma?: TrailingCommas;
  /**
   * Print trailing commas wherever possible in multi-line comma-separated syntactic structures. Defaults to "all".
   */
  trailingCommas?: TrailingCommas;
}
type JsxRuntime = 'transparent' | 'reactClassic';
interface PartialJavascriptLinter {
  /**
   * Control the linter for JavaScript (and its super languages) files.
   */
  enabled?: boolean;
}
// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface PartialJavascriptOrganizeImports {}
interface PartialJavascriptParser {
  /**
   * It enables the experimental and unsafe parsing of parameter decorators

   These decorators belong to an old proposal, and they are subject to change.
   */
  unsafeParameterDecoratorsEnabled?: boolean;
}
interface PartialJsonAssists {
  /**
   * Control the linter for JSON (and its super languages) files.
   */
  enabled?: boolean;
}
interface PartialJsonFormatter {
  /**
   * Control the formatter for JSON (and its super languages) files.
   */
  enabled?: boolean;
  /**
   * The size of the indentation applied to JSON (and its super languages) files. Default to 2.
   */
  indentSize?: IndentWidth;
  /**
   * The indent style applied to JSON (and its super languages) files.
   */
  indentStyle?: IndentStyle;
  /**
   * The size of the indentation applied to JSON (and its super languages) files. Default to 2.
   */
  indentWidth?: IndentWidth;
  /**
   * The type of line ending applied to JSON (and its super languages) files.
   */
  lineEnding?: LineEnding;
  /**
   * What's the max width of a line applied to JSON (and its super languages) files. Defaults to 80.
   */
  lineWidth?: LineWidth;
  /**
   * Print trailing commas wherever possible in multi-line comma-separated syntactic structures. Defaults to "none".
   */
  trailingCommas?: TrailingCommas2;
}
interface PartialJsonLinter {
  /**
   * Control the linter for JSON (and its super languages) files.
   */
  enabled?: boolean;
}
interface PartialJsonParser {
  /**
   * Allow parsing comments in `.json` files
   */
  allowComments?: boolean;
  /**
   * Allow parsing trailing commas in `.json` files
   */
  allowTrailingCommas?: boolean;
}
interface Rules {
  a11y?: A11y;
  /**
   * It enables ALL rules. The rules that belong to `nursery` won't be enabled.
   */
  all?: boolean;
  complexity?: Complexity;
  correctness?: Correctness;
  nursery?: Nursery;
  performance?: Performance;
  /**
   * It enables the lint rules recommended by Biome. `true` by default.
   */
  recommended?: boolean;
  security?: Security;
  style?: Style;
  suspicious?: Suspicious;
}
interface OverridePattern {
  /**
   * Specific configuration for the Css language
   */
  css?: PartialCssConfiguration;
  /**
   * Specific configuration for the Json language
   */
  formatter?: OverrideFormatterConfiguration;
  /**
   * Specific configuration for the Graphql language
   */
  graphql?: PartialGraphqlConfiguration;
  /**
   * A list of Unix shell style patterns. The formatter will ignore files/folders that will match these patterns.
   */
  ignore?: StringSet;
  /**
   * A list of Unix shell style patterns. The formatter will include files/folders that will match these patterns.
   */
  include?: StringSet;
  /**
   * Specific configuration for the JavaScript language
   */
  javascript?: PartialJavascriptConfiguration;
  /**
   * Specific configuration for the Json language
   */
  json?: PartialJsonConfiguration;
  /**
   * Specific configuration for the Json language
   */
  linter?: OverrideLinterConfiguration;
  /**
   * Specific configuration for the Json language
   */
  organizeImports?: OverrideOrganizeImportsConfiguration;
}
type VcsClientKind = 'git';
interface Source {
  /**
   * Enforce props sorting in JSX elements.
   */
  sortJsxProps?: RuleAssistConfiguration;
  /**
   * Sorts the keys of a JSON object in natural order
   */
  useSortedKeys?: RuleAssistConfiguration;
}
type QuoteStyle = 'double' | 'single';
type ArrowParentheses = 'always' | 'asNeeded';
type QuoteProperties = 'asNeeded' | 'preserve';
type Semicolons = 'always' | 'asNeeded';
type TrailingCommas = 'all' | 'es5' | 'none';
type TrailingCommas2 = 'none' | 'all';
interface A11y {
  /**
   * It enables ALL rules for this group.
   */
  all?: boolean;
  /**
   * Enforce that the accessKey attribute is not used on any HTML element.
   */
  noAccessKey?: RuleFixConfiguration_for_Null;
  /**
   * Enforce that aria-hidden="true" is not set on focusable elements.
   */
  noAriaHiddenOnFocusable?: RuleFixConfiguration_for_Null;
  /**
   * Enforce that elements that do not support ARIA roles, states, and properties do not have those attributes.
   */
  noAriaUnsupportedElements?: RuleFixConfiguration_for_Null;
  /**
   * Enforce that autoFocus prop is not used on elements.
   */
  noAutofocus?: RuleFixConfiguration_for_Null;
  /**
   * Disallow target="_blank" attribute without rel="noreferrer"
   */
  noBlankTarget?: RuleFixConfiguration_for_AllowDomainOptions;
  /**
   * Enforces that no distracting elements are used.
   */
  noDistractingElements?: RuleFixConfiguration_for_Null;
  /**
   * The scope prop should be used only on \<th> elements.
   */
  noHeaderScope?: RuleFixConfiguration_for_Null;
  /**
   * Enforce that non-interactive ARIA roles are not assigned to interactive HTML elements.
   */
  noInteractiveElementToNoninteractiveRole?: RuleFixConfiguration_for_Null;
  /**
   * Enforce that a label element or component has a text label and an associated input.
   */
  noLabelWithoutControl?: RuleConfiguration_for_NoLabelWithoutControlOptions;
  /**
   * Enforce that interactive ARIA roles are not assigned to non-interactive HTML elements.
   */
  noNoninteractiveElementToInteractiveRole?: RuleFixConfiguration_for_Null;
  /**
   * Enforce that tabIndex is not assigned to non-interactive HTML elements.
   */
  noNoninteractiveTabindex?: RuleFixConfiguration_for_Null;
  /**
   * Prevent the usage of positive integers on tabIndex property
   */
  noPositiveTabindex?: RuleFixConfiguration_for_Null;
  /**
   * Enforce img alt prop does not contain the word "image", "picture", or "photo".
   */
  noRedundantAlt?: RuleConfiguration_for_Null;
  /**
   * Enforce explicit role property is not the same as implicit/default role property on an element.
   */
  noRedundantRoles?: RuleFixConfiguration_for_Null;
  /**
   * Enforces the usage of the title element for the svg element.
   */
  noSvgWithoutTitle?: RuleConfiguration_for_Null;
  /**
   * It enables the recommended rules for this group
   */
  recommended?: boolean;
  /**
   * Enforce that all elements that require alternative text have meaningful information to relay back to the end user.
   */
  useAltText?: RuleConfiguration_for_Null;
  /**
   * Enforce that anchors have content and that the content is accessible to screen readers.
   */
  useAnchorContent?: RuleFixConfiguration_for_Null;
  /**
   * Enforce that tabIndex is assigned to non-interactive HTML elements with aria-activedescendant.
   */
  useAriaActivedescendantWithTabindex?: RuleFixConfiguration_for_Null;
  /**
   * Enforce that elements with ARIA roles must have all required ARIA attributes for that role.
   */
  useAriaPropsForRole?: RuleConfiguration_for_Null;
  /**
   * Enforces the usage of the attribute type for the element button
   */
  useButtonType?: RuleConfiguration_for_Null;
  /**
   * Elements with an interactive role and interaction handlers must be focusable.
   */
  useFocusableInteractive?: RuleConfiguration_for_Null;
  /**
   * Disallow a missing generic family keyword within font families.
   */
  useGenericFontNames?: RuleConfiguration_for_Null;
  /**
   * Enforce that heading elements (h1, h2, etc.) have content and that the content is accessible to screen readers. Accessible means that it is not hidden using the aria-hidden prop.
   */
  useHeadingContent?: RuleConfiguration_for_Null;
  /**
   * Enforce that html element has lang attribute.
   */
  useHtmlLang?: RuleConfiguration_for_Null;
  /**
   * Enforces the usage of the attribute title for the element iframe.
   */
  useIframeTitle?: RuleConfiguration_for_Null;
  /**
   * Enforce onClick is accompanied by at least one of the following: onKeyUp, onKeyDown, onKeyPress.
   */
  useKeyWithClickEvents?: RuleConfiguration_for_Null;
  /**
   * Enforce onMouseOver / onMouseOut are accompanied by onFocus / onBlur.
   */
  useKeyWithMouseEvents?: RuleConfiguration_for_Null;
  /**
   * Enforces that audio and video elements must have a track for captions.
   */
  useMediaCaption?: RuleConfiguration_for_Null;
  /**
   * It detects the use of role attributes in JSX elements and suggests using semantic elements instead.
   */
  useSemanticElements?: RuleConfiguration_for_Null;
  /**
   * Enforce that all anchors are valid, and they are navigable elements.
   */
  useValidAnchor?: RuleConfiguration_for_Null;
  /**
   * Ensures that ARIA properties aria-* are all valid.
   */
  useValidAriaProps?: RuleFixConfiguration_for_Null;
  /**
   * Elements with ARIA roles must use a valid, non-abstract ARIA role.
   */
  useValidAriaRole?: RuleFixConfiguration_for_ValidAriaRoleOptions;
  /**
   * Enforce that ARIA state and property values are valid.
   */
  useValidAriaValues?: RuleConfiguration_for_Null;
  /**
   * Ensure that the attribute passed to the lang attribute is a correct ISO language and/or country.
   */
  useValidLang?: RuleConfiguration_for_Null;
}
interface Complexity {
  /**
   * It enables ALL rules for this group.
   */
  all?: boolean;
  /**
   * Disallow primitive type aliases and misleading types.
   */
  noBannedTypes?: RuleFixConfiguration_for_Null;
  /**
   * Disallow empty type parameters in type aliases and interfaces.
   */
  noEmptyTypeParameters?: RuleConfiguration_for_Null;
  /**
   * Disallow functions that exceed a given Cognitive Complexity score.
   */
  noExcessiveCognitiveComplexity?: RuleConfiguration_for_ComplexityOptions;
  /**
   * This rule enforces a maximum depth to nested describe() in test files.
   */
  noExcessiveNestedTestSuites?: RuleConfiguration_for_Null;
  /**
   * Disallow unnecessary boolean casts
   */
  noExtraBooleanCast?: RuleFixConfiguration_for_Null;
  /**
   * Prefer for...of statement instead of Array.forEach.
   */
  noForEach?: RuleConfiguration_for_Null;
  /**
   * Disallow unclear usage of consecutive space characters in regular expression literals
   */
  noMultipleSpacesInRegularExpressionLiterals?: RuleFixConfiguration_for_Null;
  /**
   * This rule reports when a class has no non-static members, such as for a class used exclusively as a static namespace.
   */
  noStaticOnlyClass?: RuleConfiguration_for_Null;
  /**
   * Disallow this and super in static contexts.
   */
  noThisInStatic?: RuleFixConfiguration_for_Null;
  /**
   * Disallow unnecessary catch clauses.
   */
  noUselessCatch?: RuleFixConfiguration_for_Null;
  /**
   * Disallow unnecessary constructors.
   */
  noUselessConstructor?: RuleFixConfiguration_for_Null;
  /**
   * Disallow empty exports that don't change anything in a module file.
   */
  noUselessEmptyExport?: RuleFixConfiguration_for_Null;
  /**
   * Disallow unnecessary fragments
   */
  noUselessFragments?: RuleFixConfiguration_for_Null;
  /**
   * Disallow unnecessary labels.
   */
  noUselessLabel?: RuleFixConfiguration_for_Null;
  /**
   * Disallow unnecessary nested block statements.
   */
  noUselessLoneBlockStatements?: RuleFixConfiguration_for_Null;
  /**
   * Disallow renaming import, export, and destructured assignments to the same name.
   */
  noUselessRename?: RuleFixConfiguration_for_Null;
  /**
   * Disallow unnecessary concatenation of string or template literals.
   */
  noUselessStringConcat?: RuleFixConfiguration_for_Null;
  /**
   * Disallow useless case in switch statements.
   */
  noUselessSwitchCase?: RuleFixConfiguration_for_Null;
  /**
   * Disallow ternary operators when simpler alternatives exist.
   */
  noUselessTernary?: RuleFixConfiguration_for_Null;
  /**
   * Disallow useless this aliasing.
   */
  noUselessThisAlias?: RuleFixConfiguration_for_Null;
  /**
   * Disallow using any or unknown as type constraint.
   */
  noUselessTypeConstraint?: RuleFixConfiguration_for_Null;
  /**
   * Disallow initializing variables to undefined.
   */
  noUselessUndefinedInitialization?: RuleFixConfiguration_for_Null;
  /**
   * Disallow the use of void operators, which is not a familiar operator.
   */
  noVoid?: RuleConfiguration_for_Null;
  /**
   * Disallow with statements in non-strict contexts.
   */
  noWith?: RuleConfiguration_for_Null;
  /**
   * It enables the recommended rules for this group
   */
  recommended?: boolean;
  /**
   * Use arrow functions over function expressions.
   */
  useArrowFunction?: RuleFixConfiguration_for_Null;
  /**
   * Use Date.now() to get the number of milliseconds since the Unix Epoch.
   */
  useDateNow?: RuleFixConfiguration_for_Null;
  /**
   * Promotes the use of .flatMap() when map().flat() are used together.
   */
  useFlatMap?: RuleFixConfiguration_for_Null;
  /**
   * Enforce the usage of a literal access to properties over computed property access.
   */
  useLiteralKeys?: RuleFixConfiguration_for_Null;
  /**
   * Enforce using concise optional chain instead of chained logical expressions.
   */
  useOptionalChain?: RuleFixConfiguration_for_Null;
  /**
   * Enforce the use of the regular expression literals instead of the RegExp constructor if possible.
   */
  useRegexLiterals?: RuleFixConfiguration_for_Null;
  /**
   * Disallow number literal object member names which are not base10 or uses underscore as separator
   */
  useSimpleNumberKeys?: RuleFixConfiguration_for_Null;
  /**
   * Discard redundant terms from logical expressions.
   */
  useSimplifiedLogicExpression?: RuleFixConfiguration_for_Null;
}
interface Correctness {
  /**
   * It enables ALL rules for this group.
   */
  all?: boolean;
  /**
   * Prevent passing of children as props.
   */
  noChildrenProp?: RuleConfiguration_for_Null;
  /**
   * Prevents from having const variables being re-assigned.
   */
  noConstAssign?: RuleFixConfiguration_for_Null;
  /**
   * Disallow constant expressions in conditions
   */
  noConstantCondition?: RuleConfiguration_for_Null;
  /**
   * Disallow the use of Math.min and Math.max to clamp a value where the result itself is constant.
   */
  noConstantMathMinMaxClamp?: RuleFixConfiguration_for_Null;
  /**
   * Disallow returning a value from a constructor.
   */
  noConstructorReturn?: RuleConfiguration_for_Null;
  /**
   * Disallow empty character classes in regular expression literals.
   */
  noEmptyCharacterClassInRegex?: RuleConfiguration_for_Null;
  /**
   * Disallows empty destructuring patterns.
   */
  noEmptyPattern?: RuleConfiguration_for_Null;
  /**
   * Disallow to use unnecessary callback on flatMap.
   */
  noFlatMapIdentity?: RuleFixConfiguration_for_Null;
  /**
   * Disallow calling global object properties as functions
   */
  noGlobalObjectCalls?: RuleConfiguration_for_Null;
  /**
   * Disallow function and var declarations that are accessible outside their block.
   */
  noInnerDeclarations?: RuleConfiguration_for_Null;
  /**
   * Ensure that builtins are correctly instantiated.
   */
  noInvalidBuiltinInstantiation?: RuleFixConfiguration_for_Null;
  /**
   * Prevents the incorrect use of super() inside classes. It also checks whether a call super() is missing from classes that extends other constructors.
   */
  noInvalidConstructorSuper?: RuleConfiguration_for_Null;
  /**
   * Disallow non-standard direction values for linear gradient functions.
   */
  noInvalidDirectionInLinearGradient?: RuleConfiguration_for_Null;
  /**
   * Disallows invalid named grid areas in CSS Grid Layouts.
   */
  noInvalidGridAreas?: RuleConfiguration_for_Null;
  /**
   * Disallow new operators with global non-constructor functions.
   */
  noInvalidNewBuiltin?: RuleFixConfiguration_for_Null;
  /**
   * Disallow the use of @import at-rules in invalid positions.
   */
  noInvalidPositionAtImportRule?: RuleConfiguration_for_Null;
  /**
   * Disallow the use of variables and function parameters before their declaration
   */
  noInvalidUseBeforeDeclaration?: RuleConfiguration_for_Null;
  /**
   * Disallow new operators with the Symbol object.
   */
  noNewSymbol?: RuleFixConfiguration_for_Null;
  /**
   * Forbid the use of Node.js builtin modules.
   */
  noNodejsModules?: RuleConfiguration_for_Null;
  /**
   * Disallow \8 and \9 escape sequences in string literals.
   */
  noNonoctalDecimalEscape?: RuleFixConfiguration_for_Null;
  /**
   * Disallow literal numbers that lose precision
   */
  noPrecisionLoss?: RuleConfiguration_for_Null;
  /**
   * Prevent the usage of the return value of React.render.
   */
  noRenderReturnValue?: RuleConfiguration_for_Null;
  /**
   * Disallow assignments where both sides are exactly the same.
   */
  noSelfAssign?: RuleConfiguration_for_Null;
  /**
   * Disallow returning a value from a setter
   */
  noSetterReturn?: RuleConfiguration_for_Null;
  /**
   * Disallow comparison of expressions modifying the string case with non-compliant value.
   */
  noStringCaseMismatch?: RuleFixConfiguration_for_Null;
  /**
   * Disallow lexical declarations in switch clauses.
   */
  noSwitchDeclarations?: RuleFixConfiguration_for_Null;
  /**
   * Disallow the use of dependencies that aren't specified in the package.json.
   */
  noUndeclaredDependencies?: RuleConfiguration_for_Null;
  /**
   * Prevents the usage of variables that haven't been declared inside the document.
   */
  noUndeclaredVariables?: RuleConfiguration_for_Null;
  /**
   * Disallow unknown CSS value functions.
   */
  noUnknownFunction?: RuleConfiguration_for_Null;
  /**
   * Disallow unknown media feature names.
   */
  noUnknownMediaFeatureName?: RuleConfiguration_for_Null;
  /**
   * Disallow unknown properties.
   */
  noUnknownProperty?: RuleConfiguration_for_Null;
  /**
   * Disallow unknown CSS units.
   */
  noUnknownUnit?: RuleConfiguration_for_Null;
  /**
   * Disallow unmatchable An+B selectors.
   */
  noUnmatchableAnbSelector?: RuleConfiguration_for_Null;
  /**
   * Avoid using unnecessary continue.
   */
  noUnnecessaryContinue?: RuleFixConfiguration_for_Null;
  /**
   * Disallow unreachable code
   */
  noUnreachable?: RuleConfiguration_for_Null;
  /**
   * Ensures the super() constructor is called exactly once on every code  path in a class constructor before this is accessed if the class has a superclass
   */
  noUnreachableSuper?: RuleConfiguration_for_Null;
  /**
   * Disallow control flow statements in finally blocks.
   */
  noUnsafeFinally?: RuleConfiguration_for_Null;
  /**
   * Disallow the use of optional chaining in contexts where the undefined value is not allowed.
   */
  noUnsafeOptionalChaining?: RuleConfiguration_for_Null;
  /**
   * Disallow unused function parameters.
   */
  noUnusedFunctionParameters?: RuleFixConfiguration_for_Null;
  /**
   * Disallow unused imports.
   */
  noUnusedImports?: RuleFixConfiguration_for_Null;
  /**
   * Disallow unused labels.
   */
  noUnusedLabels?: RuleFixConfiguration_for_Null;
  /**
   * Disallow unused private class members
   */
  noUnusedPrivateClassMembers?: RuleFixConfiguration_for_Null;
  /**
   * Disallow unused variables.
   */
  noUnusedVariables?: RuleFixConfiguration_for_Null;
  /**
   * This rules prevents void elements (AKA self-closing elements) from having children.
   */
  noVoidElementsWithChildren?: RuleFixConfiguration_for_Null;
  /**
   * Disallow returning a value from a function with the return type 'void'
   */
  noVoidTypeReturn?: RuleConfiguration_for_Null;
  /**
   * It enables the recommended rules for this group
   */
  recommended?: boolean;
  /**
   * Disallow Array constructors.
   */
  useArrayLiterals?: RuleFixConfiguration_for_Null;
  /**
   * Enforce all dependencies are correctly specified in a React hook.
   */
  useExhaustiveDependencies?: RuleConfiguration_for_UseExhaustiveDependenciesOptions;
  /**
   * Enforce that all React hooks are being called from the Top Level component functions.
   */
  useHookAtTopLevel?: RuleConfiguration_for_DeprecatedHooksOptions;
  /**
   * Enforce file extensions for relative imports.
   */
  useImportExtensions?: RuleFixConfiguration_for_UseImportExtensionsOptions;
  /**
   * Require calls to isNaN() when checking for NaN.
   */
  useIsNan?: RuleFixConfiguration_for_Null;
  /**
   * Disallow missing key props in iterators/collection literals.
   */
  useJsxKeyInIterable?: RuleConfiguration_for_Null;
  /**
   * Enforce "for" loop update clause moving the counter in the right direction.
   */
  useValidForDirection?: RuleConfiguration_for_Null;
  /**
   * Require generator functions to contain yield.
   */
  useYield?: RuleConfiguration_for_Null;
}
interface Nursery {
  /**
   * It enables ALL rules for this group.
   */
  all?: boolean;
  /**
   * Disallow use of CommonJs module system in favor of ESM style imports.
   */
  noCommonJs?: RuleConfiguration_for_Null;
  /**
   * Disallow a lower specificity selector from coming after a higher specificity selector.
   */
  noDescendingSpecificity?: RuleConfiguration_for_Null;
  /**
   * Disallow direct assignments to document.cookie.
   */
  noDocumentCookie?: RuleConfiguration_for_Null;
  /**
   * Prevents importing next/document outside of pages/_document.jsx in Next.js projects.
   */
  noDocumentImportInPage?: RuleConfiguration_for_Null;
  /**
   * Disallow duplicate custom properties within declaration blocks.
   */
  noDuplicateCustomProperties?: RuleConfiguration_for_Null;
  /**
   * Disallow duplicate conditions in if-else-if chains
   */
  noDuplicateElseIf?: RuleConfiguration_for_Null;
  /**
   * Disallow duplicate properties within declaration blocks.
   */
  noDuplicateProperties?: RuleConfiguration_for_Null;
  /**
   * No duplicated fields in GraphQL operations.
   */
  noDuplicatedFields?: RuleConfiguration_for_Null;
  /**
   * Disallow accessing namespace imports dynamically.
   */
  noDynamicNamespaceImportAccess?: RuleConfiguration_for_Null;
  /**
   * Disallow TypeScript enum.
   */
  noEnum?: RuleConfiguration_for_Null;
  /**
   * Disallow exporting an imported variable.
   */
  noExportedImports?: RuleConfiguration_for_Null;
  /**
   * Prevent usage of \<head> element in a Next.js project.
   */
  noHeadElement?: RuleConfiguration_for_Null;
  /**
   * Prevent using the next/head module in pages/_document.js on Next.js projects.
   */
  noHeadImportInDocument?: RuleConfiguration_for_Null;
  /**
   * Prevent usage of \<img> element in a Next.js project.
   */
  noImgElement?: RuleConfiguration_for_Null;
  /**
   * Disallows the use of irregular whitespace characters.
   */
  noIrregularWhitespace?: RuleConfiguration_for_Null;
  /**
   * Disallow missing var function for css variables.
   */
  noMissingVarFunction?: RuleConfiguration_for_Null;
  /**
   * Disallow nested ternary expressions.
   */
  noNestedTernary?: RuleConfiguration_for_Null;
  /**
   * Disallow octal escape sequences in string literals
   */
  noOctalEscape?: RuleConfiguration_for_Null;
  /**
   * Disallow the use of process.env.
   */
  noProcessEnv?: RuleConfiguration_for_Null;
  /**
   * Disallow specified modules when loaded by import or require.
   */
  noRestrictedImports?: RuleConfiguration_for_RestrictedImportsOptions;
  /**
   * Disallow user defined types.
   */
  noRestrictedTypes?: RuleFixConfiguration_for_NoRestrictedTypesOptions;
  /**
   * Disallow usage of sensitive data such as API keys and tokens.
   */
  noSecrets?: RuleConfiguration_for_NoSecretsOptions;
  /**
   * Enforce that static, visible elements (such as \<div>) that have click handlers use the valid role attribute.
   */
  noStaticElementInteractions?: RuleConfiguration_for_Null;
  /**
   * Enforce the use of String.slice() over String.substr() and String.substring().
   */
  noSubstr?: RuleFixConfiguration_for_Null;
  /**
   * Disallow template literal placeholder syntax in regular strings.
   */
  noTemplateCurlyInString?: RuleConfiguration_for_Null;
  /**
   * Disallow unknown pseudo-class selectors.
   */
  noUnknownPseudoClass?: RuleConfiguration_for_Null;
  /**
   * Disallow unknown pseudo-element selectors.
   */
  noUnknownPseudoElement?: RuleConfiguration_for_Null;
  /**
   * Disallow unknown type selectors.
   */
  noUnknownTypeSelector?: RuleConfiguration_for_Null;
  /**
   * Disallow unnecessary escape sequence in regular expression literals.
   */
  noUselessEscapeInRegex?: RuleFixConfiguration_for_Null;
  /**
   * Disallow unnecessary String.raw function in template string literals without any escape sequence.
   */
  noUselessStringRaw?: RuleConfiguration_for_Null;
  /**
   * Disallow use of @value rule in css modules.
   */
  noValueAtRule?: RuleConfiguration_for_Null;
  /**
   * It enables the recommended rules for this group
   */
  recommended?: boolean;
  /**
   * Disallow the use of overload signatures that are not next to each other.
   */
  useAdjacentOverloadSignatures?: RuleConfiguration_for_Null;
  /**
   * Enforce that ARIA properties are valid for the roles that are supported by the element.
   */
  useAriaPropsSupportedByRole?: RuleConfiguration_for_Null;
  /**
   * Use at() instead of integer index access.
   */
  useAtIndex?: RuleFixConfiguration_for_Null;
  /**
   * Enforce using single if instead of nested if clauses.
   */
  useCollapsedIf?: RuleFixConfiguration_for_Null;
  /**
   * Enforce declaring components only within modules that export React Components exclusively.
   */
  useComponentExportOnlyModules?: RuleConfiguration_for_UseComponentExportOnlyModulesOptions;
  /**
   * This rule enforces consistent use of curly braces inside JSX attributes and JSX children.
   */
  useConsistentCurlyBraces?: RuleFixConfiguration_for_Null;
  /**
   * Require consistent accessibility modifiers on class properties and methods.
   */
  useConsistentMemberAccessibility?: RuleConfiguration_for_ConsistentMemberAccessibilityOptions;
  /**
   * Require specifying the reason argument when using @deprecated directive
   */
  useDeprecatedReason?: RuleConfiguration_for_Null;
  /**
   * Require explicit return types on functions and class methods.
   */
  useExplicitType?: RuleConfiguration_for_Null;
  /**
   * Enforces the use of a recommended display strategy with Google Fonts.
   */
  useGoogleFontDisplay?: RuleConfiguration_for_Null;
  /**
   * Require for-in loops to include an if statement.
   */
  useGuardForIn?: RuleConfiguration_for_Null;
  /**
   * Disallows package private imports.
   */
  useImportRestrictions?: RuleConfiguration_for_Null;
  /**
   * Enforce the sorting of CSS utility classes.
   */
  useSortedClasses?: RuleFixConfiguration_for_UtilityClassSortingOptions;
  /**
   * Enforce the use of the directive "use strict" in script files.
   */
  useStrictMode?: RuleFixConfiguration_for_Null;
  /**
   * Enforce the use of String.trimStart() and String.trimEnd() over String.trimLeft() and String.trimRight().
   */
  useTrimStartEnd?: RuleFixConfiguration_for_Null;
  /**
   * Use valid values for the autocomplete attribute on input elements.
   */
  useValidAutocomplete?: RuleConfiguration_for_UseValidAutocompleteOptions;
}
interface Performance {
  /**
   * It enables ALL rules for this group.
   */
  all?: boolean;
  /**
   * Disallow the use of spread (...) syntax on accumulators.
   */
  noAccumulatingSpread?: RuleConfiguration_for_Null;
  /**
   * Disallow the use of barrel file.
   */
  noBarrelFile?: RuleConfiguration_for_Null;
  /**
   * Disallow the use of the delete operator.
   */
  noDelete?: RuleFixConfiguration_for_Null;
  /**
   * Avoid re-export all.
   */
  noReExportAll?: RuleConfiguration_for_Null;
  /**
   * It enables the recommended rules for this group
   */
  recommended?: boolean;
  /**
   * Require regex literals to be declared at the top level.
   */
  useTopLevelRegex?: RuleConfiguration_for_Null;
}
interface Security {
  /**
   * It enables ALL rules for this group.
   */
  all?: boolean;
  /**
   * Prevent the usage of dangerous JSX props
   */
  noDangerouslySetInnerHtml?: RuleConfiguration_for_Null;
  /**
   * Report when a DOM element or a component uses both children and dangerouslySetInnerHTML prop.
   */
  noDangerouslySetInnerHtmlWithChildren?: RuleConfiguration_for_Null;
  /**
   * Disallow the use of global eval().
   */
  noGlobalEval?: RuleConfiguration_for_Null;
  /**
   * It enables the recommended rules for this group
   */
  recommended?: boolean;
}
interface Style {
  /**
   * It enables ALL rules for this group.
   */
  all?: boolean;
  /**
   * Disallow the use of arguments.
   */
  noArguments?: RuleConfiguration_for_Null;
  /**
   * Disallow comma operator.
   */
  noCommaOperator?: RuleConfiguration_for_Null;
  /**
   * Disallow default exports.
   */
  noDefaultExport?: RuleConfiguration_for_Null;
  /**
   * Disallow using a callback in asynchronous tests and hooks.
   */
  noDoneCallback?: RuleConfiguration_for_Null;
  /**
   * Disallow implicit true values on JSX boolean attributes
   */
  noImplicitBoolean?: RuleFixConfiguration_for_Null;
  /**
   * Disallow type annotations for variables, parameters, and class properties initialized with a literal expression.
   */
  noInferrableTypes?: RuleFixConfiguration_for_Null;
  /**
   * Disallow the use of TypeScript's namespaces.
   */
  noNamespace?: RuleConfiguration_for_Null;
  /**
   * Disallow the use of namespace imports.
   */
  noNamespaceImport?: RuleConfiguration_for_Null;
  /**
   * Disallow negation in the condition of an if statement if it has an else clause.
   */
  noNegationElse?: RuleFixConfiguration_for_Null;
  /**
   * Disallow non-null assertions using the ! postfix operator.
   */
  noNonNullAssertion?: RuleFixConfiguration_for_Null;
  /**
   * Disallow reassigning function parameters.
   */
  noParameterAssign?: RuleConfiguration_for_Null;
  /**
   * Disallow the use of parameter properties in class constructors.
   */
  noParameterProperties?: RuleConfiguration_for_Null;
  /**
   * This rule allows you to specify global variable names that you don’t want to use in your application.
   */
  noRestrictedGlobals?: RuleConfiguration_for_RestrictedGlobalsOptions;
  /**
   * Disallow the use of constants which its value is the upper-case version of its name.
   */
  noShoutyConstants?: RuleFixConfiguration_for_Null;
  /**
   * Disallow template literals if interpolation and special-character handling are not needed
   */
  noUnusedTemplateLiteral?: RuleFixConfiguration_for_Null;
  /**
   * Disallow else block when the if block breaks early.
   */
  noUselessElse?: RuleFixConfiguration_for_Null;
  /**
   * Disallow the use of var
   */
  noVar?: RuleFixConfiguration_for_Null;
  /**
   * Disallow the use of yoda expressions.
   */
  noYodaExpression?: RuleFixConfiguration_for_Null;
  /**
   * It enables the recommended rules for this group
   */
  recommended?: boolean;
  /**
   * Enforce the use of as const over literal type and type annotation.
   */
  useAsConstAssertion?: RuleFixConfiguration_for_Null;
  /**
   * Requires following curly brace conventions.
   */
  useBlockStatements?: RuleFixConfiguration_for_Null;
  /**
   * Enforce using else if instead of nested if in else clauses.
   */
  useCollapsedElseIf?: RuleFixConfiguration_for_Null;
  /**
   * Require consistently using either T\[] or Array\<T>
   */
  useConsistentArrayType?: RuleFixConfiguration_for_ConsistentArrayTypeOptions;
  /**
   * Enforce the use of new for all builtins, except String, Number and Boolean.
   */
  useConsistentBuiltinInstantiation?: RuleFixConfiguration_for_Null;
  /**
   * Require const declarations for variables that are only assigned once.
   */
  useConst?: RuleFixConfiguration_for_Null;
  /**
   * Enforce default function parameters and optional function parameters to be last.
   */
  useDefaultParameterLast?: RuleFixConfiguration_for_Null;
  /**
   * Require the default clause in switch statements.
   */
  useDefaultSwitchClause?: RuleConfiguration_for_Null;
  /**
   * Require that each enum member value be explicitly initialized.
   */
  useEnumInitializers?: RuleFixConfiguration_for_Null;
  /**
   * Enforce explicitly comparing the length, size, byteLength or byteOffset property of a value.
   */
  useExplicitLengthCheck?: RuleFixConfiguration_for_Null;
  /**
   * Disallow the use of Math.pow in favor of the ** operator.
   */
  useExponentiationOperator?: RuleFixConfiguration_for_Null;
  /**
   * Promotes the use of export type for types.
   */
  useExportType?: RuleFixConfiguration_for_Null;
  /**
   * Enforce naming conventions for JavaScript and TypeScript filenames.
   */
  useFilenamingConvention?: RuleConfiguration_for_FilenamingConventionOptions;
  /**
   * This rule recommends a for-of loop when in a for loop, the index used to extract an item from the iterated array.
   */
  useForOf?: RuleConfiguration_for_Null;
  /**
   * This rule enforces the use of \<>...\</> over \<Fragment>...\</Fragment>.
   */
  useFragmentSyntax?: RuleFixConfiguration_for_Null;
  /**
   * Promotes the use of import type for types.
   */
  useImportType?: RuleFixConfiguration_for_Null;
  /**
   * Require all enum members to be literal values.
   */
  useLiteralEnumMembers?: RuleConfiguration_for_Null;
  /**
   * Enforce naming conventions for everything across a codebase.
   */
  useNamingConvention?: RuleFixConfiguration_for_NamingConventionOptions;
  /**
   * Promotes the usage of node:assert/strict over node:assert.
   */
  useNodeAssertStrict?: RuleFixConfiguration_for_Null;
  /**
   * Enforces using the node: protocol for Node.js builtin modules.
   */
  useNodejsImportProtocol?: RuleFixConfiguration_for_Null;
  /**
   * Use the Number properties instead of global ones.
   */
  useNumberNamespace?: RuleFixConfiguration_for_Null;
  /**
   * Disallow parseInt() and Number.parseInt() in favor of binary, octal, and hexadecimal literals
   */
  useNumericLiterals?: RuleFixConfiguration_for_Null;
  /**
   * Prevent extra closing tags for components without children
   */
  useSelfClosingElements?: RuleFixConfiguration_for_Null;
  /**
   * When expressing array types, this rule promotes the usage of T\[] shorthand instead of Array\<T>.
   */
  useShorthandArrayType?: RuleFixConfiguration_for_Null;
  /**
   * Require assignment operator shorthand where possible.
   */
  useShorthandAssign?: RuleFixConfiguration_for_Null;
  /**
   * Enforce using function types instead of object type with call signatures.
   */
  useShorthandFunctionType?: RuleFixConfiguration_for_Null;
  /**
   * Enforces switch clauses have a single statement, emits a quick fix wrapping the statements in a block.
   */
  useSingleCaseStatement?: RuleFixConfiguration_for_Null;
  /**
   * Disallow multiple variable declarations in the same variable statement
   */
  useSingleVarDeclarator?: RuleFixConfiguration_for_Null;
  /**
   * Prefer template literals over string concatenation.
   */
  useTemplate?: RuleFixConfiguration_for_Null;
  /**
   * Require new when throwing an error.
   */
  useThrowNewError?: RuleFixConfiguration_for_Null;
  /**
   * Disallow throwing non-Error values.
   */
  useThrowOnlyError?: RuleConfiguration_for_Null;
  /**
   * Enforce the use of while loops instead of for loops when the initializer and update expressions are not needed.
   */
  useWhile?: RuleFixConfiguration_for_Null;
}
interface Suspicious {
  /**
   * It enables ALL rules for this group.
   */
  all?: boolean;
  /**
   * Use standard constants instead of approximated literals.
   */
  noApproximativeNumericConstant?: RuleFixConfiguration_for_Null;
  /**
   * Discourage the usage of Array index in keys.
   */
  noArrayIndexKey?: RuleConfiguration_for_Null;
  /**
   * Disallow assignments in expressions.
   */
  noAssignInExpressions?: RuleConfiguration_for_Null;
  /**
   * Disallows using an async function as a Promise executor.
   */
  noAsyncPromiseExecutor?: RuleConfiguration_for_Null;
  /**
   * Disallow reassigning exceptions in catch clauses.
   */
  noCatchAssign?: RuleConfiguration_for_Null;
  /**
   * Disallow reassigning class members.
   */
  noClassAssign?: RuleConfiguration_for_Null;
  /**
   * Prevent comments from being inserted as text nodes
   */
  noCommentText?: RuleFixConfiguration_for_Null;
  /**
   * Disallow comparing against -0
   */
  noCompareNegZero?: RuleFixConfiguration_for_Null;
  /**
   * Disallow labeled statements that are not loops.
   */
  noConfusingLabels?: RuleConfiguration_for_Null;
  /**
   * Disallow void type outside of generic or return types.
   */
  noConfusingVoidType?: RuleFixConfiguration_for_Null;
  /**
   * Disallow the use of console.
   */
  noConsole?: RuleFixConfiguration_for_NoConsoleOptions;
  /**
   * Disallow the use of console.log
   */
  noConsoleLog?: RuleFixConfiguration_for_Null;
  /**
   * Disallow TypeScript const enum
   */
  noConstEnum?: RuleFixConfiguration_for_Null;
  /**
   * Prevents from having control characters and some escape sequences that match control characters in regular expressions.
   */
  noControlCharactersInRegex?: RuleConfiguration_for_Null;
  /**
   * Disallow the use of debugger
   */
  noDebugger?: RuleFixConfiguration_for_Null;
  /**
   * Require the use of === and !==.
   */
  noDoubleEquals?: RuleFixConfiguration_for_NoDoubleEqualsOptions;
  /**
   * Disallow duplicate @import rules.
   */
  noDuplicateAtImportRules?: RuleConfiguration_for_Null;
  /**
   * Disallow duplicate case labels.
   */
  noDuplicateCase?: RuleConfiguration_for_Null;
  /**
   * Disallow duplicate class members.
   */
  noDuplicateClassMembers?: RuleConfiguration_for_Null;
  /**
   * Disallow duplicate names within font families.
   */
  noDuplicateFontNames?: RuleConfiguration_for_Null;
  /**
   * Prevents JSX properties to be assigned multiple times.
   */
  noDuplicateJsxProps?: RuleConfiguration_for_Null;
  /**
   * Disallow two keys with the same name inside objects.
   */
  noDuplicateObjectKeys?: RuleConfiguration_for_Null;
  /**
   * Disallow duplicate function parameter name.
   */
  noDuplicateParameters?: RuleConfiguration_for_Null;
  /**
   * Disallow duplicate selectors within keyframe blocks.
   */
  noDuplicateSelectorsKeyframeBlock?: RuleConfiguration_for_Null;
  /**
   * A describe block should not contain duplicate hooks.
   */
  noDuplicateTestHooks?: RuleConfiguration_for_Null;
  /**
   * Disallow CSS empty blocks.
   */
  noEmptyBlock?: RuleConfiguration_for_Null;
  /**
   * Disallow empty block statements and static blocks.
   */
  noEmptyBlockStatements?: RuleConfiguration_for_Null;
  /**
   * Disallow the declaration of empty interfaces.
   */
  noEmptyInterface?: RuleFixConfiguration_for_Null;
  /**
   * Disallow variables from evolving into any type through reassignments.
   */
  noEvolvingTypes?: RuleConfiguration_for_Null;
  /**
   * Disallow the any type usage.
   */
  noExplicitAny?: RuleConfiguration_for_Null;
  /**
   * Disallow using export or module.exports in files containing tests
   */
  noExportsInTest?: RuleConfiguration_for_Null;
  /**
   * Prevents the wrong usage of the non-null assertion operator (!) in TypeScript files.
   */
  noExtraNonNullAssertion?: RuleFixConfiguration_for_Null;
  /**
   * Disallow fallthrough of switch clauses.
   */
  noFallthroughSwitchClause?: RuleConfiguration_for_Null;
  /**
   * Disallow focused tests.
   */
  noFocusedTests?: RuleFixConfiguration_for_Null;
  /**
   * Disallow reassigning function declarations.
   */
  noFunctionAssign?: RuleConfiguration_for_Null;
  /**
   * Disallow assignments to native objects and read-only global variables.
   */
  noGlobalAssign?: RuleConfiguration_for_Null;
  /**
   * Use Number.isFinite instead of global isFinite.
   */
  noGlobalIsFinite?: RuleFixConfiguration_for_Null;
  /**
   * Use Number.isNaN instead of global isNaN.
   */
  noGlobalIsNan?: RuleFixConfiguration_for_Null;
  /**
   * Disallow use of implicit any type on variable declarations.
   */
  noImplicitAnyLet?: RuleConfiguration_for_Null;
  /**
   * Disallow assigning to imported bindings
   */
  noImportAssign?: RuleConfiguration_for_Null;
  /**
   * Disallow invalid !important within keyframe declarations
   */
  noImportantInKeyframe?: RuleConfiguration_for_Null;
  /**
   * Disallow labels that share a name with a variable
   */
  noLabelVar?: RuleConfiguration_for_Null;
  /**
   * Disallow characters made with multiple code points in character class syntax.
   */
  noMisleadingCharacterClass?: RuleFixConfiguration_for_Null;
  /**
   * Enforce proper usage of new and constructor.
   */
  noMisleadingInstantiator?: RuleConfiguration_for_Null;
  /**
   * Checks that the assertion function, for example expect, is placed inside an it() function call.
   */
  noMisplacedAssertion?: RuleConfiguration_for_Null;
  /**
   * Disallow shorthand assign when variable appears on both sides.
   */
  noMisrefactoredShorthandAssign?: RuleFixConfiguration_for_Null;
  /**
   * Disallow direct use of Object.prototype builtins.
   */
  noPrototypeBuiltins?: RuleConfiguration_for_Null;
  /**
   * Prevents React-specific JSX properties from being used.
   */
  noReactSpecificProps?: RuleFixConfiguration_for_Null;
  /**
   * Disallow variable, function, class, and type redeclarations in the same scope.
   */
  noRedeclare?: RuleConfiguration_for_Null;
  /**
   * Prevents from having redundant "use strict".
   */
  noRedundantUseStrict?: RuleFixConfiguration_for_Null;
  /**
   * Disallow comparisons where both sides are exactly the same.
   */
  noSelfCompare?: RuleConfiguration_for_Null;
  /**
   * Disallow identifiers from shadowing restricted names.
   */
  noShadowRestrictedNames?: RuleConfiguration_for_Null;
  /**
   * Disallow shorthand properties that override related longhand properties.
   */
  noShorthandPropertyOverrides?: RuleConfiguration_for_Null;
  /**
   * Disallow disabled tests.
   */
  noSkippedTests?: RuleFixConfiguration_for_Null;
  /**
   * Disallow sparse arrays
   */
  noSparseArray?: RuleFixConfiguration_for_Null;
  /**
   * It detects possible "wrong" semicolons inside JSX elements.
   */
  noSuspiciousSemicolonInJsx?: RuleConfiguration_for_Null;
  /**
   * Disallow then property.
   */
  noThenProperty?: RuleConfiguration_for_Null;
  /**
   * Disallow unsafe declaration merging between interfaces and classes.
   */
  noUnsafeDeclarationMerging?: RuleConfiguration_for_Null;
  /**
   * Disallow using unsafe negation.
   */
  noUnsafeNegation?: RuleFixConfiguration_for_Null;
  /**
   * It enables the recommended rules for this group
   */
  recommended?: boolean;
  /**
   * Ensure async functions utilize await.
   */
  useAwait?: RuleConfiguration_for_Null;
  /**
   * Enforce default clauses in switch statements to be last
   */
  useDefaultSwitchClauseLast?: RuleConfiguration_for_Null;
  /**
   * Enforce passing a message value when creating a built-in error.
   */
  useErrorMessage?: RuleConfiguration_for_Null;
  /**
   * Enforce get methods to always return a value.
   */
  useGetterReturn?: RuleConfiguration_for_Null;
  /**
   * Use Array.isArray() instead of instanceof Array.
   */
  useIsArray?: RuleFixConfiguration_for_Null;
  /**
   * Require using the namespace keyword over the module keyword to declare TypeScript namespaces.
   */
  useNamespaceKeyword?: RuleFixConfiguration_for_Null;
  /**
   * Enforce using the digits argument with Number#toFixed().
   */
  useNumberToFixedDigitsArgument?: RuleFixConfiguration_for_Null;
  /**
   * This rule verifies the result of typeof $expr unary expressions is being compared to valid values, either string literals containing valid type names or other typeof expressions
   */
  useValidTypeof?: RuleFixConfiguration_for_Null;
}
interface OverrideFormatterConfiguration {
  /**
   * The attribute position style.
   */
  attributePosition?: AttributePosition;
  /**
   * Whether to insert spaces around brackets in object literals. Defaults to true.
   */
  bracketSpacing?: BracketSpacing;
  enabled?: boolean;
  /**
   * Stores whether formatting should be allowed to proceed if a given file has syntax errors
   */
  formatWithErrors?: boolean;
  /**
   * The size of the indentation, 2 by default (deprecated, use `indent-width`)
   */
  indentSize?: IndentWidth;
  /**
   * The indent style.
   */
  indentStyle?: IndentStyle;
  /**
   * The size of the indentation, 2 by default
   */
  indentWidth?: IndentWidth;
  /**
   * The type of line ending.
   */
  lineEnding?: LineEnding;
  /**
   * What's the max width of a line. Defaults to 80.
   */
  lineWidth?: LineWidth;
}
interface OverrideLinterConfiguration {
  /**
   * if `false`, it disables the feature and the linter won't be executed. `true` by default
   */
  enabled?: boolean;
  /**
   * List of rules
   */
  rules?: Rules;
}
interface OverrideOrganizeImportsConfiguration {
  /**
   * if `false`, it disables the feature and the linter won't be executed. `true` by default
   */
  enabled?: boolean;
}
type RuleAssistConfiguration = 'on' | 'off';
type RuleFixConfiguration_for_Null =
  | RulePlainConfiguration
  | RuleWithFixOptions_for_Null;
type RuleFixConfiguration_for_AllowDomainOptions =
  | RulePlainConfiguration
  | RuleWithFixOptions_for_AllowDomainOptions;
type RuleConfiguration_for_NoLabelWithoutControlOptions =
  | RulePlainConfiguration
  | RuleWithOptions_for_NoLabelWithoutControlOptions;
type RuleConfiguration_for_Null =
  | RulePlainConfiguration
  | RuleWithOptions_for_Null;
type RuleFixConfiguration_for_ValidAriaRoleOptions =
  | RulePlainConfiguration
  | RuleWithFixOptions_for_ValidAriaRoleOptions;
type RuleConfiguration_for_ComplexityOptions =
  | RulePlainConfiguration
  | RuleWithOptions_for_ComplexityOptions;
type RuleConfiguration_for_UseExhaustiveDependenciesOptions =
  | RulePlainConfiguration
  | RuleWithOptions_for_UseExhaustiveDependenciesOptions;
type RuleConfiguration_for_DeprecatedHooksOptions =
  | RulePlainConfiguration
  | RuleWithOptions_for_DeprecatedHooksOptions;
type RuleFixConfiguration_for_UseImportExtensionsOptions =
  | RulePlainConfiguration
  | RuleWithFixOptions_for_UseImportExtensionsOptions;
type RuleConfiguration_for_RestrictedImportsOptions =
  | RulePlainConfiguration
  | RuleWithOptions_for_RestrictedImportsOptions;
type RuleFixConfiguration_for_NoRestrictedTypesOptions =
  | RulePlainConfiguration
  | RuleWithFixOptions_for_NoRestrictedTypesOptions;
type RuleConfiguration_for_NoSecretsOptions =
  | RulePlainConfiguration
  | RuleWithOptions_for_NoSecretsOptions;
type RuleConfiguration_for_UseComponentExportOnlyModulesOptions =
  | RulePlainConfiguration
  | RuleWithOptions_for_UseComponentExportOnlyModulesOptions;
type RuleConfiguration_for_ConsistentMemberAccessibilityOptions =
  | RulePlainConfiguration
  | RuleWithOptions_for_ConsistentMemberAccessibilityOptions;
type RuleFixConfiguration_for_UtilityClassSortingOptions =
  | RulePlainConfiguration
  | RuleWithFixOptions_for_UtilityClassSortingOptions;
type RuleConfiguration_for_UseValidAutocompleteOptions =
  | RulePlainConfiguration
  | RuleWithOptions_for_UseValidAutocompleteOptions;
type RuleConfiguration_for_RestrictedGlobalsOptions =
  | RulePlainConfiguration
  | RuleWithOptions_for_RestrictedGlobalsOptions;
type RuleFixConfiguration_for_ConsistentArrayTypeOptions =
  | RulePlainConfiguration
  | RuleWithFixOptions_for_ConsistentArrayTypeOptions;
type RuleConfiguration_for_FilenamingConventionOptions =
  | RulePlainConfiguration
  | RuleWithOptions_for_FilenamingConventionOptions;
type RuleFixConfiguration_for_NamingConventionOptions =
  | RulePlainConfiguration
  | RuleWithFixOptions_for_NamingConventionOptions;
type RuleFixConfiguration_for_NoConsoleOptions =
  | RulePlainConfiguration
  | RuleWithFixOptions_for_NoConsoleOptions;
type RuleFixConfiguration_for_NoDoubleEqualsOptions =
  | RulePlainConfiguration
  | RuleWithFixOptions_for_NoDoubleEqualsOptions;
type RulePlainConfiguration = 'warn' | 'error' | 'info' | 'off';
interface RuleWithFixOptions_for_Null {
  /**
   * The kind of the code actions emitted by the rule
   */
  fix?: FixKind;
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: null;
}
interface RuleWithFixOptions_for_AllowDomainOptions {
  /**
   * The kind of the code actions emitted by the rule
   */
  fix?: FixKind;
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: AllowDomainOptions;
}
interface RuleWithOptions_for_NoLabelWithoutControlOptions {
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: NoLabelWithoutControlOptions;
}
interface RuleWithOptions_for_Null {
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: null;
}
interface RuleWithFixOptions_for_ValidAriaRoleOptions {
  /**
   * The kind of the code actions emitted by the rule
   */
  fix?: FixKind;
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: ValidAriaRoleOptions;
}
interface RuleWithOptions_for_ComplexityOptions {
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: ComplexityOptions;
}
interface RuleWithOptions_for_UseExhaustiveDependenciesOptions {
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: UseExhaustiveDependenciesOptions;
}
interface RuleWithOptions_for_DeprecatedHooksOptions {
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: DeprecatedHooksOptions;
}
interface RuleWithFixOptions_for_UseImportExtensionsOptions {
  /**
   * The kind of the code actions emitted by the rule
   */
  fix?: FixKind;
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: UseImportExtensionsOptions;
}
interface RuleWithOptions_for_RestrictedImportsOptions {
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: RestrictedImportsOptions;
}
interface RuleWithFixOptions_for_NoRestrictedTypesOptions {
  /**
   * The kind of the code actions emitted by the rule
   */
  fix?: FixKind;
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: NoRestrictedTypesOptions;
}
interface RuleWithOptions_for_NoSecretsOptions {
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: NoSecretsOptions;
}
interface RuleWithOptions_for_UseComponentExportOnlyModulesOptions {
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: UseComponentExportOnlyModulesOptions;
}
interface RuleWithOptions_for_ConsistentMemberAccessibilityOptions {
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: ConsistentMemberAccessibilityOptions;
}
interface RuleWithFixOptions_for_UtilityClassSortingOptions {
  /**
   * The kind of the code actions emitted by the rule
   */
  fix?: FixKind;
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: UtilityClassSortingOptions;
}
interface RuleWithOptions_for_UseValidAutocompleteOptions {
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: UseValidAutocompleteOptions;
}
interface RuleWithOptions_for_RestrictedGlobalsOptions {
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: RestrictedGlobalsOptions;
}
interface RuleWithFixOptions_for_ConsistentArrayTypeOptions {
  /**
   * The kind of the code actions emitted by the rule
   */
  fix?: FixKind;
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: ConsistentArrayTypeOptions;
}
interface RuleWithOptions_for_FilenamingConventionOptions {
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: FilenamingConventionOptions;
}
interface RuleWithFixOptions_for_NamingConventionOptions {
  /**
   * The kind of the code actions emitted by the rule
   */
  fix?: FixKind;
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: NamingConventionOptions;
}
interface RuleWithFixOptions_for_NoConsoleOptions {
  /**
   * The kind of the code actions emitted by the rule
   */
  fix?: FixKind;
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: NoConsoleOptions;
}
interface RuleWithFixOptions_for_NoDoubleEqualsOptions {
  /**
   * The kind of the code actions emitted by the rule
   */
  fix?: FixKind;
  /**
   * The severity of the emitted diagnostics by the rule
   */
  level: RulePlainConfiguration;
  /**
   * Rule's options
   */
  options: NoDoubleEqualsOptions;
}
type FixKind = 'none' | 'safe' | 'unsafe';
interface AllowDomainOptions {
  /**
   * List of domains to allow `target="_blank"` without `rel="noreferrer"`
   */
  allowDomains: string[];
}
interface NoLabelWithoutControlOptions {
  /**
   * Array of component names that should be considered the same as an `input` element.
   */
  inputComponents?: string[];
  /**
   * Array of attributes that should be treated as the `label` accessible text content.
   */
  labelAttributes?: string[];
  /**
   * Array of component names that should be considered the same as a `label` element.
   */
  labelComponents?: string[];
}
interface ValidAriaRoleOptions {
  allowInvalidRoles?: string[];
  ignoreNonDom?: boolean;
}
interface ComplexityOptions {
  /**
   * The maximum complexity score that we allow. Anything higher is considered excessive.
   */
  maxAllowedComplexity?: number;
}
interface UseExhaustiveDependenciesOptions {
  /**
   * List of hooks of which the dependencies should be validated.
   */
  hooks?: Hook[];
  /**
   * Whether to report an error when a hook has no dependencies array.
   */
  reportMissingDependenciesArray?: boolean;
  /**
   * Whether to report an error when a dependency is listed in the dependencies array but isn't used. Defaults to true.
   */
  reportUnnecessaryDependencies?: boolean;
}
// biome-ignore lint/suspicious/noEmptyInterface: <explanation>
interface DeprecatedHooksOptions {}
interface UseImportExtensionsOptions {
  /**
   * A map of custom import extension mappings, where the key is the inspected file extension, and the value is a pair of `module` extension and `component` import extension
   */
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  suggestedExtensions?: {};
}
interface RestrictedImportsOptions {
  /**
   * A list of names that should trigger the rule
   */
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  paths: {};
}
interface NoRestrictedTypesOptions {
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  types?: {};
}
interface NoSecretsOptions {
  /**
   * Set entropy threshold (default is 41).
   */
  entropyThreshold?: number;
}
interface UseComponentExportOnlyModulesOptions {
  /**
   * Allows the export of constants. This option is for environments that support it, such as [Vite](https://vitejs.dev/)
   */
  allowConstantExport?: boolean;
  /**
   * A list of names that can be additionally exported from the module This option is for exports that do not hinder [React Fast Refresh](https://github.com/facebook/react/tree/main/packages/react-refresh), such as [`meta` in Remix](https://remix.run/docs/en/main/route/meta)
   */
  allowExportNames: string[];
}
interface ConsistentMemberAccessibilityOptions {
  accessibility?: Accessibility;
}
interface UtilityClassSortingOptions {
  /**
   * Additional attributes that will be sorted.
   */
  attributes?: string[];
  /**
   * Names of the functions or tagged templates that will be sorted.
   */
  functions?: string[];
}
interface UseValidAutocompleteOptions {
  /**
   * `input` like custom components that should be checked.
   */
  inputComponents?: string[];
}
interface RestrictedGlobalsOptions {
  /**
   * A list of names that should trigger the rule
   */
  deniedGlobals: string[];
}
interface ConsistentArrayTypeOptions {
  syntax?: ConsistentArrayType;
}
interface FilenamingConventionOptions {
  /**
   * Allowed cases for file names.
   */
  filenameCases: FilenameCases;
  /**
   * If `false`, then non-ASCII characters are allowed.
   */
  requireAscii: boolean;
  /**
   * If `false`, then consecutive uppercase are allowed in _camel_ and _pascal_ cases. This does not affect other [Case].
   */
  strictCase: boolean;
}
interface NamingConventionOptions {
  /**
   * Custom conventions.
   */
  conventions: Convention[];
  /**
   * Allowed cases for _TypeScript_ `enum` member names.
   */
  enumMemberCase: Format;
  /**
   * If `false`, then non-ASCII characters are allowed.
   */
  requireAscii: boolean;
  /**
   * If `false`, then consecutive uppercase are allowed in _camel_ and _pascal_ cases. This does not affect other [Case].
   */
  strictCase: boolean;
}
interface NoConsoleOptions {
  /**
   * Allowed calls on the console object.
   */
  allow: string[];
}
interface NoDoubleEqualsOptions {
  /**
   * If `true`, an exception is made when comparing with `null`, as it's often relied on to check both for `null` or `undefined`.

   If `false`, no such exception will be made.
   */
  ignoreNull: boolean;
}
interface Hook {
  /**
   * The "position" of the closure function, starting from zero.

   For example, for React's `useEffect()` hook, the closure index is 0.
   */
  closureIndex?: number;
  /**
   * The "position" of the array of dependencies, starting from zero.

   For example, for React's `useEffect()` hook, the dependencies index is 1.
   */
  dependenciesIndex?: number;
  /**
   * The name of the hook.
   */
  name?: string;
  /**
   * Whether the result of the hook is stable.

   Set to `true` to mark the identity of the hook's return value as stable, or use a number/an array of numbers to mark the "positions" in the return array as stable.

   For example, for React's `useRef()` hook the value would be `true`, while for `useState()` it would be `[1]`.
   */
  stableResult?: StableHookResult;
}
type Accessibility = 'noPublic' | 'explicit' | 'none';
type ConsistentArrayType = 'shorthand' | 'generic';
type FilenameCases = FilenameCase[];
interface Convention {
  /**
   * String cases to enforce
   */
  formats: Formats;
  /**
   * Regular expression to enforce
   */
  match?: Regex;
  /**
   * Declarations concerned by this convention
   */
  selector: Selector;
}
type Format = 'camelCase' | 'CONSTANT_CASE' | 'PascalCase' | 'snake_case';
type StableHookResult = boolean | number[];
type FilenameCase =
  | 'camelCase'
  | 'export'
  | 'kebab-case'
  | 'PascalCase'
  | 'snake_case';
type Formats = Format[];
type Regex = string;
interface Selector {
  /**
   * Declaration kind
   */
  kind: Kind;
  /**
   * Modifiers used on the declaration
   */
  modifiers: Modifiers;
  /**
   * Scope of the declaration
   */
  scope: Scope;
}
type Kind =
  | 'class'
  | 'enum'
  | 'interface'
  | 'enumMember'
  | 'importNamespace'
  | 'exportNamespace'
  | 'variable'
  | 'const'
  | 'let'
  | 'using'
  | 'var'
  | 'catchParameter'
  | 'indexParameter'
  | 'exportAlias'
  | 'importAlias'
  | 'classGetter'
  | 'classSetter'
  | 'classMethod'
  | 'objectLiteralProperty'
  | 'objectLiteralGetter'
  | 'objectLiteralSetter'
  | 'objectLiteralMethod'
  | 'typeAlias'
  | 'any'
  | 'typeLike'
  | 'function'
  | 'namespaceLike'
  | 'namespace'
  | 'functionParameter'
  | 'typeParameter'
  | 'classMember'
  | 'classProperty'
  | 'objectLiteralMember'
  | 'typeMember'
  | 'typeGetter'
  | 'typeProperty'
  | 'typeSetter'
  | 'typeMethod';
type Modifiers = RestrictedModifier[];
type Scope = 'any' | 'global';
type RestrictedModifier =
  | 'abstract'
  | 'private'
  | 'protected'
  | 'readonly'
  | 'static';
interface RegisterProjectFolderParams {
  path?: string;
  setAsCurrentWorkspace: boolean;
}
type ProjectKey = string;
interface SetManifestForProjectParams {
  content: string;
  manifest_path: BiomePath;
  version: number;
}
interface OpenFileParams {
  // @janpoem
  // shall it can be object like: { type: 'fromClient', content, version: 0 }
  content: string;
  document_file_source?: DocumentFileSource;
  // @janpoem
  // shall it can be string value?
  path: BiomePath;
  version: number;
}
type DocumentFileSource =
  | 'Unknown'
  | { Js: JsFileSource }
  | { Json: JsonFileSource }
  | { Css: CssFileSource }
  | { Graphql: GraphqlFileSource }
  | { Html: HtmlFileSource }
  | { Grit: GritFileSource };
interface JsFileSource {
  /**
   * Used to mark if the source is being used for an Astro, Svelte or Vue file
   */
  embedding_kind: EmbeddingKind;
  language: Language;
  module_kind: ModuleKind;
  variant: LanguageVariant;
  version: LanguageVersion;
}
interface JsonFileSource {
  allow_comments: boolean;
  allow_trailing_commas: boolean;
}
interface CssFileSource {
  variant: CssVariant;
}
interface GraphqlFileSource {
  variant: GraphqlVariant;
}
interface HtmlFileSource {
  variant: HtmlVariant;
}
interface GritFileSource {
  variant: GritVariant;
}
type EmbeddingKind = 'Astro' | 'Vue' | 'Svelte' | 'None';
type Language = 'JavaScript' | { TypeScript: { definition_file: boolean } };
type ModuleKind = 'Script' | 'Module';
type LanguageVariant = 'Standard' | 'StandardRestricted' | 'Jsx';
type LanguageVersion = 'ES2022' | 'ESNext';
type CssVariant = 'Standard';
type GraphqlVariant = 'Standard';
type HtmlVariant = 'Standard' | 'Astro';
type GritVariant = 'Standard';
interface ChangeFileParams {
  content: string;
  path: BiomePath;
  version: number;
}
interface CloseFileParams {
  path: BiomePath;
}
interface GetSyntaxTreeParams {
  path: BiomePath;
}
interface GetSyntaxTreeResult {
  ast: string;
  cst: string;
}
interface OrganizeImportsParams {
  path: BiomePath;
}
interface OrganizeImportsResult {
  code: string;
}
interface GetFileContentParams {
  path: BiomePath;
}
interface GetControlFlowGraphParams {
  cursor: TextSize;
  path: BiomePath;
}
type TextSize = number;
interface GetFormatterIRParams {
  path: BiomePath;
}
interface PullDiagnosticsParams {
  categories: RuleCategories;
  max_diagnostics: number;
  only: RuleCode[];
  path: BiomePath;
  skip: RuleCode[];
}
type RuleCategories = RuleCategory[];
type RuleCode = string;
type RuleCategory = 'Syntax' | 'Lint' | 'Action' | 'Transformation';
interface PullDiagnosticsResult {
  diagnostics: Diagnostic[];
  errors: number;
  skipped_diagnostics: number;
}
interface Diagnostic {
  advices: Advices;
  category?: Category;
  description: string;
  location: Location;
  message: MarkupBuf;
  severity: Severity;
  source?: Diagnostic;
  tags: DiagnosticTags;
  verboseAdvices: Advices;
}
interface Advices {
  advices: Advice[];
}
type Category =
  | 'lint/a11y/noAccessKey'
  | 'lint/a11y/noAriaHiddenOnFocusable'
  | 'lint/a11y/noAriaUnsupportedElements'
  | 'lint/a11y/noAutofocus'
  | 'lint/a11y/noBlankTarget'
  | 'lint/a11y/noDistractingElements'
  | 'lint/a11y/noHeaderScope'
  | 'lint/a11y/noInteractiveElementToNoninteractiveRole'
  | 'lint/a11y/noLabelWithoutControl'
  | 'lint/a11y/noNoninteractiveElementToInteractiveRole'
  | 'lint/a11y/noNoninteractiveTabindex'
  | 'lint/a11y/noPositiveTabindex'
  | 'lint/a11y/noRedundantAlt'
  | 'lint/a11y/noRedundantRoles'
  | 'lint/a11y/noSvgWithoutTitle'
  | 'lint/a11y/useAltText'
  | 'lint/a11y/useAnchorContent'
  | 'lint/a11y/useAriaActivedescendantWithTabindex'
  | 'lint/a11y/useAriaPropsForRole'
  | 'lint/a11y/useButtonType'
  | 'lint/a11y/useFocusableInteractive'
  | 'lint/a11y/useGenericFontNames'
  | 'lint/a11y/useHeadingContent'
  | 'lint/a11y/useHtmlLang'
  | 'lint/a11y/useIframeTitle'
  | 'lint/a11y/useKeyWithClickEvents'
  | 'lint/a11y/useKeyWithMouseEvents'
  | 'lint/a11y/useMediaCaption'
  | 'lint/a11y/useSemanticElements'
  | 'lint/a11y/useValidAnchor'
  | 'lint/a11y/useValidAriaProps'
  | 'lint/a11y/useValidAriaRole'
  | 'lint/a11y/useValidAriaValues'
  | 'lint/a11y/useValidLang'
  | 'lint/complexity/noBannedTypes'
  | 'lint/complexity/noEmptyTypeParameters'
  | 'lint/complexity/noExcessiveCognitiveComplexity'
  | 'lint/complexity/noExcessiveNestedTestSuites'
  | 'lint/complexity/noExtraBooleanCast'
  | 'lint/complexity/noForEach'
  | 'lint/complexity/noMultipleSpacesInRegularExpressionLiterals'
  | 'lint/complexity/noStaticOnlyClass'
  | 'lint/complexity/noThisInStatic'
  | 'lint/complexity/noUselessCatch'
  | 'lint/complexity/noUselessConstructor'
  | 'lint/complexity/noUselessEmptyExport'
  | 'lint/complexity/noUselessFragments'
  | 'lint/complexity/noUselessLabel'
  | 'lint/complexity/noUselessLoneBlockStatements'
  | 'lint/complexity/noUselessRename'
  | 'lint/complexity/noUselessStringConcat'
  | 'lint/complexity/noUselessSwitchCase'
  | 'lint/complexity/noUselessTernary'
  | 'lint/complexity/noUselessThisAlias'
  | 'lint/complexity/noUselessTypeConstraint'
  | 'lint/complexity/noUselessUndefinedInitialization'
  | 'lint/complexity/noVoid'
  | 'lint/complexity/noWith'
  | 'lint/complexity/useArrowFunction'
  | 'lint/complexity/useDateNow'
  | 'lint/complexity/useFlatMap'
  | 'lint/complexity/useLiteralKeys'
  | 'lint/complexity/useOptionalChain'
  | 'lint/complexity/useRegexLiterals'
  | 'lint/complexity/useSimpleNumberKeys'
  | 'lint/complexity/useSimplifiedLogicExpression'
  | 'lint/correctness/noChildrenProp'
  | 'lint/correctness/noConstAssign'
  | 'lint/correctness/noConstantCondition'
  | 'lint/correctness/noConstantMathMinMaxClamp'
  | 'lint/correctness/noConstructorReturn'
  | 'lint/correctness/noEmptyCharacterClassInRegex'
  | 'lint/correctness/noEmptyPattern'
  | 'lint/correctness/noFlatMapIdentity'
  | 'lint/correctness/noGlobalObjectCalls'
  | 'lint/correctness/noInnerDeclarations'
  | 'lint/correctness/noInvalidBuiltinInstantiation'
  | 'lint/correctness/noInvalidConstructorSuper'
  | 'lint/correctness/noInvalidDirectionInLinearGradient'
  | 'lint/correctness/noInvalidGridAreas'
  | 'lint/correctness/noInvalidNewBuiltin'
  | 'lint/correctness/noInvalidPositionAtImportRule'
  | 'lint/correctness/noInvalidUseBeforeDeclaration'
  | 'lint/correctness/noNewSymbol'
  | 'lint/correctness/noNodejsModules'
  | 'lint/correctness/noNonoctalDecimalEscape'
  | 'lint/correctness/noPrecisionLoss'
  | 'lint/correctness/noRenderReturnValue'
  | 'lint/correctness/noSelfAssign'
  | 'lint/correctness/noSetterReturn'
  | 'lint/correctness/noStringCaseMismatch'
  | 'lint/correctness/noSwitchDeclarations'
  | 'lint/correctness/noUndeclaredDependencies'
  | 'lint/correctness/noUndeclaredVariables'
  | 'lint/correctness/noUnknownFunction'
  | 'lint/correctness/noUnknownMediaFeatureName'
  | 'lint/correctness/noUnknownProperty'
  | 'lint/correctness/noUnknownUnit'
  | 'lint/correctness/noUnmatchableAnbSelector'
  | 'lint/correctness/noUnnecessaryContinue'
  | 'lint/correctness/noUnreachable'
  | 'lint/correctness/noUnreachableSuper'
  | 'lint/correctness/noUnsafeFinally'
  | 'lint/correctness/noUnsafeOptionalChaining'
  | 'lint/correctness/noUnusedFunctionParameters'
  | 'lint/correctness/noUnusedImports'
  | 'lint/correctness/noUnusedLabels'
  | 'lint/correctness/noUnusedPrivateClassMembers'
  | 'lint/correctness/noUnusedVariables'
  | 'lint/correctness/noVoidElementsWithChildren'
  | 'lint/correctness/noVoidTypeReturn'
  | 'lint/correctness/useArrayLiterals'
  | 'lint/correctness/useExhaustiveDependencies'
  | 'lint/correctness/useHookAtTopLevel'
  | 'lint/correctness/useImportExtensions'
  | 'lint/correctness/useIsNan'
  | 'lint/correctness/useJsxKeyInIterable'
  | 'lint/correctness/useValidForDirection'
  | 'lint/correctness/useYield'
  | 'lint/nursery/colorNoInvalidHex'
  | 'lint/nursery/noColorInvalidHex'
  | 'lint/nursery/noCommonJs'
  | 'lint/nursery/noConsole'
  | 'lint/nursery/noDescendingSpecificity'
  | 'lint/nursery/noDocumentCookie'
  | 'lint/nursery/noDocumentImportInPage'
  | 'lint/nursery/noDoneCallback'
  | 'lint/nursery/noDuplicateAtImportRules'
  | 'lint/nursery/noDuplicateCustomProperties'
  | 'lint/nursery/noDuplicateElseIf'
  | 'lint/nursery/noDuplicateProperties'
  | 'lint/nursery/noDuplicatedFields'
  | 'lint/nursery/noDynamicNamespaceImportAccess'
  | 'lint/nursery/noEnum'
  | 'lint/nursery/noExportedImports'
  | 'lint/nursery/noHeadElement'
  | 'lint/nursery/noHeadImportInDocument'
  | 'lint/nursery/noImgElement'
  | 'lint/nursery/noImportantInKeyframe'
  | 'lint/nursery/noInvalidDirectionInLinearGradient'
  | 'lint/nursery/noInvalidGridAreas'
  | 'lint/nursery/noInvalidPositionAtImportRule'
  | 'lint/nursery/noIrregularWhitespace'
  | 'lint/nursery/noMissingGenericFamilyKeyword'
  | 'lint/nursery/noMissingVarFunction'
  | 'lint/nursery/noNestedTernary'
  | 'lint/nursery/noOctalEscape'
  | 'lint/nursery/noProcessEnv'
  | 'lint/nursery/noReactSpecificProps'
  | 'lint/nursery/noRestrictedImports'
  | 'lint/nursery/noRestrictedTypes'
  | 'lint/nursery/noSecrets'
  | 'lint/nursery/noShorthandPropertyOverrides'
  | 'lint/nursery/noStaticElementInteractions'
  | 'lint/nursery/noSubstr'
  | 'lint/nursery/noTemplateCurlyInString'
  | 'lint/nursery/noUndeclaredDependencies'
  | 'lint/nursery/noUnknownFunction'
  | 'lint/nursery/noUnknownMediaFeatureName'
  | 'lint/nursery/noUnknownProperty'
  | 'lint/nursery/noUnknownPseudoClass'
  | 'lint/nursery/noUnknownPseudoClassSelector'
  | 'lint/nursery/noUnknownPseudoElement'
  | 'lint/nursery/noUnknownSelectorPseudoElement'
  | 'lint/nursery/noUnknownTypeSelector'
  | 'lint/nursery/noUnknownUnit'
  | 'lint/nursery/noUnmatchableAnbSelector'
  | 'lint/nursery/noUnusedFunctionParameters'
  | 'lint/nursery/noUselessEscapeInRegex'
  | 'lint/nursery/noUselessStringRaw'
  | 'lint/nursery/noValueAtRule'
  | 'lint/nursery/useAdjacentOverloadSignatures'
  | 'lint/nursery/useAriaPropsSupportedByRole'
  | 'lint/nursery/useAtIndex'
  | 'lint/nursery/useBiomeSuppressionComment'
  | 'lint/nursery/useCollapsedIf'
  | 'lint/nursery/useComponentExportOnlyModules'
  | 'lint/nursery/useConsistentCurlyBraces'
  | 'lint/nursery/useConsistentMemberAccessibility'
  | 'lint/nursery/useDeprecatedReason'
  | 'lint/nursery/useExplicitFunctionReturnType'
  | 'lint/nursery/useExplicitType'
  | 'lint/nursery/useGoogleFontDisplay'
  | 'lint/nursery/useGuardForIn'
  | 'lint/nursery/useImportRestrictions'
  | 'lint/nursery/useJsxCurlyBraceConvention'
  | 'lint/nursery/useSortedClasses'
  | 'lint/nursery/useStrictMode'
  | 'lint/nursery/useTrimStartEnd'
  | 'lint/nursery/useValidAutocomplete'
  | 'lint/performance/noAccumulatingSpread'
  | 'lint/performance/noBarrelFile'
  | 'lint/performance/noDelete'
  | 'lint/performance/noReExportAll'
  | 'lint/performance/useTopLevelRegex'
  | 'lint/security/noDangerouslySetInnerHtml'
  | 'lint/security/noDangerouslySetInnerHtmlWithChildren'
  | 'lint/security/noGlobalEval'
  | 'lint/style/noArguments'
  | 'lint/style/noCommaOperator'
  | 'lint/style/noDefaultExport'
  | 'lint/style/noDoneCallback'
  | 'lint/style/noImplicitBoolean'
  | 'lint/style/noInferrableTypes'
  | 'lint/style/noNamespace'
  | 'lint/style/noNamespaceImport'
  | 'lint/style/noNegationElse'
  | 'lint/style/noNonNullAssertion'
  | 'lint/style/noParameterAssign'
  | 'lint/style/noParameterProperties'
  | 'lint/style/noRestrictedGlobals'
  | 'lint/style/noShoutyConstants'
  | 'lint/style/noUnusedTemplateLiteral'
  | 'lint/style/noUselessElse'
  | 'lint/style/noVar'
  | 'lint/style/noYodaExpression'
  | 'lint/style/useAsConstAssertion'
  | 'lint/style/useBlockStatements'
  | 'lint/style/useCollapsedElseIf'
  | 'lint/style/useConsistentArrayType'
  | 'lint/style/useConsistentBuiltinInstantiation'
  | 'lint/style/useConst'
  | 'lint/style/useDefaultParameterLast'
  | 'lint/style/useDefaultSwitchClause'
  | 'lint/style/useEnumInitializers'
  | 'lint/style/useExplicitLengthCheck'
  | 'lint/style/useExponentiationOperator'
  | 'lint/style/useExportType'
  | 'lint/style/useFilenamingConvention'
  | 'lint/style/useForOf'
  | 'lint/style/useFragmentSyntax'
  | 'lint/style/useImportType'
  | 'lint/style/useLiteralEnumMembers'
  | 'lint/style/useNamingConvention'
  | 'lint/style/useNodeAssertStrict'
  | 'lint/style/useNodejsImportProtocol'
  | 'lint/style/useNumberNamespace'
  | 'lint/style/useNumericLiterals'
  | 'lint/style/useSelfClosingElements'
  | 'lint/style/useShorthandArrayType'
  | 'lint/style/useShorthandAssign'
  | 'lint/style/useShorthandFunctionType'
  | 'lint/style/useSingleCaseStatement'
  | 'lint/style/useSingleVarDeclarator'
  | 'lint/style/useTemplate'
  | 'lint/style/useThrowNewError'
  | 'lint/style/useThrowOnlyError'
  | 'lint/style/useWhile'
  | 'lint/suspicious/noApproximativeNumericConstant'
  | 'lint/suspicious/noArrayIndexKey'
  | 'lint/suspicious/noAssignInExpressions'
  | 'lint/suspicious/noAsyncPromiseExecutor'
  | 'lint/suspicious/noCatchAssign'
  | 'lint/suspicious/noClassAssign'
  | 'lint/suspicious/noCommentText'
  | 'lint/suspicious/noCompareNegZero'
  | 'lint/suspicious/noConfusingLabels'
  | 'lint/suspicious/noConfusingVoidType'
  | 'lint/suspicious/noConsole'
  | 'lint/suspicious/noConsoleLog'
  | 'lint/suspicious/noConstEnum'
  | 'lint/suspicious/noControlCharactersInRegex'
  | 'lint/suspicious/noDebugger'
  | 'lint/suspicious/noDoubleEquals'
  | 'lint/suspicious/noDuplicateAtImportRules'
  | 'lint/suspicious/noDuplicateCase'
  | 'lint/suspicious/noDuplicateClassMembers'
  | 'lint/suspicious/noDuplicateFontNames'
  | 'lint/suspicious/noDuplicateJsxProps'
  | 'lint/suspicious/noDuplicateObjectKeys'
  | 'lint/suspicious/noDuplicateParameters'
  | 'lint/suspicious/noDuplicateSelectorsKeyframeBlock'
  | 'lint/suspicious/noDuplicateTestHooks'
  | 'lint/suspicious/noEmptyBlock'
  | 'lint/suspicious/noEmptyBlockStatements'
  | 'lint/suspicious/noEmptyInterface'
  | 'lint/suspicious/noEvolvingTypes'
  | 'lint/suspicious/noExplicitAny'
  | 'lint/suspicious/noExportsInTest'
  | 'lint/suspicious/noExtraNonNullAssertion'
  | 'lint/suspicious/noFallthroughSwitchClause'
  | 'lint/suspicious/noFocusedTests'
  | 'lint/suspicious/noFunctionAssign'
  | 'lint/suspicious/noGlobalAssign'
  | 'lint/suspicious/noGlobalIsFinite'
  | 'lint/suspicious/noGlobalIsNan'
  | 'lint/suspicious/noImplicitAnyLet'
  | 'lint/suspicious/noImportAssign'
  | 'lint/suspicious/noImportantInKeyframe'
  | 'lint/suspicious/noLabelVar'
  | 'lint/suspicious/noMisleadingCharacterClass'
  | 'lint/suspicious/noMisleadingInstantiator'
  | 'lint/suspicious/noMisplacedAssertion'
  | 'lint/suspicious/noMisrefactoredShorthandAssign'
  | 'lint/suspicious/noPrototypeBuiltins'
  | 'lint/suspicious/noReactSpecificProps'
  | 'lint/suspicious/noRedeclare'
  | 'lint/suspicious/noRedundantUseStrict'
  | 'lint/suspicious/noSelfCompare'
  | 'lint/suspicious/noShadowRestrictedNames'
  | 'lint/suspicious/noShorthandPropertyOverrides'
  | 'lint/suspicious/noSkippedTests'
  | 'lint/suspicious/noSparseArray'
  | 'lint/suspicious/noSuspiciousSemicolonInJsx'
  | 'lint/suspicious/noThenProperty'
  | 'lint/suspicious/noUnsafeDeclarationMerging'
  | 'lint/suspicious/noUnsafeNegation'
  | 'lint/suspicious/useAwait'
  | 'lint/suspicious/useDefaultSwitchClauseLast'
  | 'lint/suspicious/useErrorMessage'
  | 'lint/suspicious/useGetterReturn'
  | 'lint/suspicious/useIsArray'
  | 'lint/suspicious/useNamespaceKeyword'
  | 'lint/suspicious/useNumberToFixedDigitsArgument'
  | 'lint/suspicious/useValidTypeof'
  | 'assists/source/useSortedKeys'
  | 'syntax/correctness/noTypeOnlyImportAttributes'
  | 'syntax/correctness/noSuperWithoutExtends'
  | 'syntax/correctness/noInitializerWithDefinite'
  | 'syntax/correctness/noDuplicatePrivateClassMembers'
  | 'files/missingHandler'
  | 'format'
  | 'check'
  | 'ci'
  | 'stdin'
  | 'configuration'
  | 'organizeImports'
  | 'assists'
  | 'migrate'
  | 'deserialize'
  | 'project'
  | 'search'
  | 'internalError/io'
  | 'internalError/fs'
  | 'internalError/panic'
  | 'reporter/parse'
  | 'reporter/format'
  | 'reporter/analyzer'
  | 'reporter/organizeImports'
  | 'parse'
  | 'lint'
  | 'lint/a11y'
  | 'lint/complexity'
  | 'lint/correctness'
  | 'lint/nursery'
  | 'lint/performance'
  | 'lint/security'
  | 'lint/style'
  | 'lint/suspicious'
  | 'suppressions/parse'
  | 'suppressions/unknownGroup'
  | 'suppressions/unknownRule'
  | 'suppressions/unused'
  | 'suppressions/deprecatedSuppressionComment'
  | 'args/fileNotFound'
  | 'flags/invalid'
  | 'semanticTests';
interface Location {
  path?: Resource_for_String;
  sourceCode?: string;
  span?: TextRange;
}
type MarkupBuf = MarkupNodeBuf[];
type Severity = 'hint' | 'information' | 'warning' | 'error' | 'fatal';
type DiagnosticTags = DiagnosticTag[];
type Advice =
  | { log: [LogCategory, MarkupBuf] }
  | { list: MarkupBuf[] }
  | { frame: Location }
  | { diff: TextEdit }
  | { backtrace: [MarkupBuf, Backtrace] }
  | { command: string }
  | { group: [MarkupBuf, Advices] };
type Resource_for_String = 'argv' | 'memory' | { file: string };
type TextRange = [TextSize, TextSize];
interface MarkupNodeBuf {
  content: string;
  elements: MarkupElement[];
}
type DiagnosticTag =
  | 'fixable'
  | 'internal'
  | 'unnecessaryCode'
  | 'deprecatedCode'
  | 'verbose';
type LogCategory = 'none' | 'info' | 'warn' | 'error';
interface TextEdit {
  dictionary: string;
  ops: CompressedOp[];
}
type Backtrace = BacktraceFrame[];
type MarkupElement =
  | 'Emphasis'
  | 'Dim'
  | 'Italic'
  | 'Underline'
  | 'Error'
  | 'Success'
  | 'Warn'
  | 'Info'
  | 'Debug'
  | 'Trace'
  | 'Inverse'
  | { Hyperlink: { href: string } };
type CompressedOp = { diffOp: DiffOp } | { equalLines: { line_count: number } };
interface BacktraceFrame {
  ip: number;
  symbols: BacktraceSymbol[];
}
type DiffOp =
  | { equal: { range: TextRange } }
  | { insert: { range: TextRange } }
  | { delete: { range: TextRange } };
interface BacktraceSymbol {
  colno?: number;
  filename?: string;
  lineno?: number;
  name?: string;
}
interface PullActionsParams {
  only: RuleCode[];
  path: BiomePath;
  range?: TextRange;
  skip: RuleCode[];
}
interface PullActionsResult {
  actions: CodeAction[];
}
interface CodeAction {
  category: ActionCategory;
  rule_name?: [string, string];
  suggestion: CodeSuggestion;
}
type ActionCategory =
  | 'QuickFix'
  | { Refactor: RefactorKind }
  | { Source: SourceActionKind }
  | { Other: string };
interface CodeSuggestion {
  applicability: Applicability;
  labels: TextRange[];
  msg: MarkupBuf;
  span: TextRange;
  suggestion: TextEdit;
}
type RefactorKind =
  | 'None'
  | 'Extract'
  | 'Inline'
  | 'Rewrite'
  | { Other: string };
type SourceActionKind =
  | 'FixAll'
  | 'None'
  | 'OrganizeImports'
  | { Other: string };
type Applicability = 'Always' | 'MaybeIncorrect';
interface FormatFileParams {
  path: BiomePath;
}
interface Printed {
  code: string;
  range?: TextRange;
  sourcemap: SourceMarker[];
  verbatim_ranges: TextRange[];
}
interface SourceMarker {
  /**
   * Position of the marker in the output code
   */
  dest: TextSize;
  /**
   * Position of the marker in the original source
   */
  source: TextSize;
}
interface FormatRangeParams {
  path: BiomePath;
  range: TextRange;
}
interface FormatOnTypeParams {
  offset: TextSize;
  path: BiomePath;
}
interface FixFileParams {
  fix_file_mode: FixFileMode;
  only: RuleCode[];
  path: BiomePath;
  rule_categories: RuleCategories;
  should_format: boolean;
  skip: RuleCode[];
}
type FixFileMode = 'SafeFixes' | 'SafeAndUnsafeFixes';
interface FixFileResult {
  /**
   * List of all the code actions applied to the file
   */
  actions: FixAction[];
  /**
   * New source code for the file with all fixes applied
   */
  code: string;
  /**
   * Number of errors
   */
  errors: number;
  /**
   * number of skipped suggested fixes
   */
  skipped_suggested_fixes: number;
}
interface FixAction {
  /**
   * Source range at which this action was applied
   */
  range: TextRange;
  /**
   * Name of the rule group and rule that emitted this code action
   */
  rule_name?: [string, string];
}
interface RenameParams {
  new_name: string;
  path: BiomePath;
  symbol_at: TextSize;
}
interface RenameResult {
  /**
   * List of text edit operations to apply on the source code
   */
  indels: TextEdit;
  /**
   * Range of source code modified by this rename operation
   */
  range: TextRange;
}

/**
 */
export class DiagnosticPrinter {
  free(): void;
  /**
   * @param {string} file_name
   * @param {string} file_source
   */
  constructor(file_name: string, file_source: string);
  /**
   * @param {Diagnostic} diagnostic
   */
  print_simple(diagnostic: Diagnostic): void;
  /**
   * @param {Diagnostic} diagnostic
   */
  print_verbose(diagnostic: Diagnostic): void;
  /**
   * @returns {string}
   */
  finish(): string;
}
/**
 */
export class Workspace {
  free(): void;
  /**
   */
  constructor();
  /**
   * @param {SupportsFeatureParams} params
   * @returns {FileFeaturesResult}
   */
  fileFeatures(params: SupportsFeatureParams): FileFeaturesResult;
  /**
   * @param {UpdateSettingsParams} params
   */
  updateSettings(params: UpdateSettingsParams): void;
  /**
   * @param {RegisterProjectFolderParams} params
   * @returns {ProjectKey}
   */
  registerProjectFolder(params: RegisterProjectFolderParams): ProjectKey;
  /**
   * @param {OpenFileParams} params
   */
  openFile(params: OpenFileParams): void;
  /**
   * @param {GetFileContentParams} params
   * @returns {string}
   */
  getFileContent(params: GetFileContentParams): string;
  /**
   * @param {GetSyntaxTreeParams} params
   * @returns {GetSyntaxTreeResult}
   */
  getSyntaxTree(params: GetSyntaxTreeParams): GetSyntaxTreeResult;
  /**
   * @param {GetControlFlowGraphParams} params
   * @returns {string}
   */
  getControlFlowGraph(params: GetControlFlowGraphParams): string;
  /**
   * @param {GetFormatterIRParams} params
   * @returns {string}
   */
  getFormatterIr(params: GetFormatterIRParams): string;
  /**
   * @param {ChangeFileParams} params
   */
  changeFile(params: ChangeFileParams): void;
  /**
   * @param {CloseFileParams} params
   */
  closeFile(params: CloseFileParams): void;
  /**
   * @param {PullDiagnosticsParams} params
   * @returns {PullDiagnosticsResult}
   */
  pullDiagnostics(params: PullDiagnosticsParams): PullDiagnosticsResult;
  /**
   * @param {PullActionsParams} params
   * @returns {PullActionsResult}
   */
  pullActions(params: PullActionsParams): PullActionsResult;
  /**
   * @param {FormatFileParams} params
   * @returns {any}
   */
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  formatFile(params: FormatFileParams): any;
  /**
   * @param {FormatRangeParams} params
   * @returns {any}
   */
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  formatRange(params: FormatRangeParams): any;
  /**
   * @param {FormatOnTypeParams} params
   * @returns {any}
   */
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  formatOnType(params: FormatOnTypeParams): any;
  /**
   * @param {FixFileParams} params
   * @returns {FixFileResult}
   */
  fixFile(params: FixFileParams): FixFileResult;
  /**
   * @param {OrganizeImportsParams} params
   * @returns {OrganizeImportsResult}
   */
  organizeImports(params: OrganizeImportsParams): OrganizeImportsResult;
  /**
   * @param {RenameParams} params
   * @returns {RenameResult}
   */
  rename(params: RenameParams): RenameResult;
}

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_workspace_free: (a: number, b: number) => void;
  readonly workspace_new: () => number;
  readonly workspace_fileFeatures: (a: number, b: number, c: number) => void;
  readonly workspace_updateSettings: (a: number, b: number, c: number) => void;
  readonly workspace_registerProjectFolder: (
    a: number,
    b: number,
    c: number,
  ) => void;
  readonly workspace_openFile: (a: number, b: number, c: number) => void;
  readonly workspace_getFileContent: (a: number, b: number, c: number) => void;
  readonly workspace_getSyntaxTree: (a: number, b: number, c: number) => void;
  readonly workspace_getControlFlowGraph: (
    a: number,
    b: number,
    c: number,
  ) => void;
  readonly workspace_getFormatterIr: (a: number, b: number, c: number) => void;
  readonly workspace_changeFile: (a: number, b: number, c: number) => void;
  readonly workspace_closeFile: (a: number, b: number, c: number) => void;
  readonly workspace_pullDiagnostics: (a: number, b: number, c: number) => void;
  readonly workspace_pullActions: (a: number, b: number, c: number) => void;
  readonly workspace_formatFile: (a: number, b: number, c: number) => void;
  readonly workspace_formatRange: (a: number, b: number, c: number) => void;
  readonly workspace_formatOnType: (a: number, b: number, c: number) => void;
  readonly workspace_fixFile: (a: number, b: number, c: number) => void;
  readonly workspace_organizeImports: (a: number, b: number, c: number) => void;
  readonly workspace_rename: (a: number, b: number, c: number) => void;
  readonly main: () => void;
  readonly __wbg_diagnosticprinter_free: (a: number, b: number) => void;
  readonly diagnosticprinter_new: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => number;
  readonly diagnosticprinter_print_simple: (
    a: number,
    b: number,
    c: number,
  ) => void;
  readonly diagnosticprinter_print_verbose: (
    a: number,
    b: number,
    c: number,
  ) => void;
  readonly diagnosticprinter_finish: (a: number, b: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (
    a: number,
    b: number,
    c: number,
    d: number,
  ) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(
  module: { module: SyncInitInput } | SyncInitInput,
): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?:
    | { module_or_path: InitInput | Promise<InitInput> }
    | InitInput
    | Promise<InitInput>,
): Promise<InitOutput>;
