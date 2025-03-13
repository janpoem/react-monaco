export default {
  // @ts-ignore
  filename: 'indent_handler.go',
  source: `
//go:build go1.21
// ref: https://github.com/golang/example/blob/master/slog-handler-guide/indenthandler4/indent_handler.go

package indenthandler

import (
\t"context"
\t"fmt"
\t"io"
\t"log/slog"
\t"runtime"
\t"slices"
\t"strconv"
\t"sync"
\t"time"
)

// !+IndentHandler
type IndentHandler struct {
\topts           Options
\tpreformatted   []byte   // data from WithGroup and WithAttrs
\tunopenedGroups []string // groups from WithGroup that haven't been opened
\tindentLevel    int      // same as number of opened groups so far
\tmu             *sync.Mutex
\tout            io.Writer
}

//!-IndentHandler

type Options struct {
\t// Level reports the minimum level to log.
\t// Levels with lower levels are discarded.
\t// If nil, the Handler uses [slog.LevelInfo].
\tLevel slog.Leveler
}

func New(out io.Writer, opts *Options) *IndentHandler {
\th := &IndentHandler{out: out, mu: &sync.Mutex{}}
\tif opts != nil {
\t\th.opts = *opts
\t}
\tif h.opts.Level == nil {
\t\th.opts.Level = slog.LevelInfo
\t}
\treturn h
}

func (h *IndentHandler) Enabled(ctx context.Context, level slog.Level) bool {
\treturn level >= h.opts.Level.Level()
}

// !+WithGroup
func (h *IndentHandler) WithGroup(name string) slog.Handler {
\tif name == "" {
\t\treturn h
\t}
\th2 := *h
\t// Add an unopened group to h2 without modifying h.
\th2.unopenedGroups = make([]string, len(h.unopenedGroups)+1)
\tcopy(h2.unopenedGroups, h.unopenedGroups)
\th2.unopenedGroups[len(h2.unopenedGroups)-1] = name
\treturn &h2
}

//!-WithGroup

// !+WithAttrs
func (h *IndentHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
\tif len(attrs) == 0 {
\t\treturn h
\t}
\th2 := *h
\t// Force an append to copy the underlying array.
\tpre := slices.Clip(h.preformatted)
\t// Add all groups from WithGroup that haven't already been added.
\th2.preformatted = h2.appendUnopenedGroups(pre, h2.indentLevel)
\t// Each of those groups increased the indent level by 1.
\th2.indentLevel += len(h2.unopenedGroups)
\t// Now all groups have been opened.
\th2.unopenedGroups = nil
\t// Pre-format the attributes.
\tfor _, a := range attrs {
\t\th2.preformatted = h2.appendAttr(h2.preformatted, a, h2.indentLevel)
\t}
\treturn &h2
}

func (h *IndentHandler) appendUnopenedGroups(buf []byte, indentLevel int) []byte {
\tfor _, g := range h.unopenedGroups {
\t\tbuf = fmt.Appendf(buf, "%*s%s:\\n", indentLevel*4, "", g)
\t\tindentLevel++
\t}
\treturn buf
}

//!-WithAttrs

// !+Handle
func (h *IndentHandler) Handle(ctx context.Context, r slog.Record) error {
\tbufp := allocBuf()
\tbuf := *bufp
\tdefer func() {
\t\t*bufp = buf
\t\tfreeBuf(bufp)
\t}()
\tif !r.Time.IsZero() {
\t\tbuf = h.appendAttr(buf, slog.Time(slog.TimeKey, r.Time), 0)
\t}
\tbuf = h.appendAttr(buf, slog.Any(slog.LevelKey, r.Level), 0)
\tif r.PC != 0 {
\t\tfs := runtime.CallersFrames([]uintptr{r.PC})
\t\tf, _ := fs.Next()
\t\t// Optimize to minimize allocation.
\t\tsrcbufp := allocBuf()
\t\tdefer freeBuf(srcbufp)
\t\t*srcbufp = append(*srcbufp, f.File...)
\t\t*srcbufp = append(*srcbufp, ':')
\t\t*srcbufp = strconv.AppendInt(*srcbufp, int64(f.Line), 10)
\t\tbuf = h.appendAttr(buf, slog.String(slog.SourceKey, string(*srcbufp)), 0)
\t}

\tbuf = h.appendAttr(buf, slog.String(slog.MessageKey, r.Message), 0)
\t// Insert preformatted attributes just after built-in ones.
\tbuf = append(buf, h.preformatted...)
\tif r.NumAttrs() > 0 {
\t\tbuf = h.appendUnopenedGroups(buf, h.indentLevel)
\t\tr.Attrs(func(a slog.Attr) bool {
\t\t\tbuf = h.appendAttr(buf, a, h.indentLevel+len(h.unopenedGroups))
\t\t\treturn true
\t\t})
\t}
\tbuf = append(buf, "---\\n"...)
\th.mu.Lock()
\tdefer h.mu.Unlock()
\t_, err := h.out.Write(buf)
\treturn err
}

//!-Handle

func (h *IndentHandler) appendAttr(buf []byte, a slog.Attr, indentLevel int) []byte {
\t// Resolve the Attr's value before doing anything else.
\ta.Value = a.Value.Resolve()
\t// Ignore empty Attrs.
\tif a.Equal(slog.Attr{}) {
\t\treturn buf
\t}
\t// Indent 4 spaces per level.
\tbuf = fmt.Appendf(buf, "%*s", indentLevel*4, "")
\tswitch a.Value.Kind() {
\tcase slog.KindString:
\t\t// Quote string values, to make them easy to parse.
\t\tbuf = append(buf, a.Key...)
\t\tbuf = append(buf, ": "...)
\t\tbuf = strconv.AppendQuote(buf, a.Value.String())
\t\tbuf = append(buf, '\\n')
\tcase slog.KindTime:
\t\t// Write times in a standard way, without the monotonic time.
\t\tbuf = append(buf, a.Key...)
\t\tbuf = append(buf, ": "...)
\t\tbuf = a.Value.Time().AppendFormat(buf, time.RFC3339Nano)
\t\tbuf = append(buf, '\\n')
\tcase slog.KindGroup:
\t\tattrs := a.Value.Group()
\t\t// Ignore empty groups.
\t\tif len(attrs) == 0 {
\t\t\treturn buf
\t\t}
\t\t// If the key is non-empty, write it out and indent the rest of the attrs.
\t\t// Otherwise, inline the attrs.
\t\tif a.Key != "" {
\t\t\tbuf = fmt.Appendf(buf, "%s:\\n", a.Key)
\t\t\tindentLevel++
\t\t}
\t\tfor _, ga := range attrs {
\t\t\tbuf = h.appendAttr(buf, ga, indentLevel)
\t\t}

\tdefault:
\t\tbuf = append(buf, a.Key...)
\t\tbuf = append(buf, ": "...)
\t\tbuf = append(buf, a.Value.String()...)
\t\tbuf = append(buf, '\\n')
\t}
\treturn buf
}

// !+pool
var bufPool = sync.Pool{
\tNew: func() any {
\t\tb := make([]byte, 0, 1024)
\t\treturn &b
\t},
}

func allocBuf() *[]byte {
\treturn bufPool.Get().(*[]byte)
}

func freeBuf(b *[]byte) {
\t// To reduce peak allocation, return only smaller buffers to the pool.
\tconst maxBufferSize = 16 << 10
\tif cap(*b) <= maxBufferSize {
\t\t*b = (*b)[:0]
\t\tbufPool.Put(b)
\t}
}

//!-pool
`.trim(),
};
