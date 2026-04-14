import { TERMINAL_LINES } from '../constants/content';
import { useHomeSceneContext } from '../context/HomeSceneContext';

export function LoaderOverlay() {
  const {
    activeTerminalLine,
    loaderIrisRef,
    loaderOverlayRef,
    showLoader,
    terminalLines,
    terminalProgress,
  } = useHomeSceneContext();
  const terminalComplete = terminalLines.length >= TERMINAL_LINES.length;
  const terminalProgressLabel = `${String(terminalProgress).padStart(3, '0')}%`;
  const isTotalLoadDone = terminalComplete && terminalProgress >= 100;
  if (!showLoader) return null;

  return (
    <div ref={loaderOverlayRef} className="site-loader">
      <div ref={loaderIrisRef} className="loader-iris" aria-hidden="true" />
      <div className="terminal-shell">
        <div className="terminal-topbar" aria-hidden="true">
          <div className="terminal-status-cluster">
            <span className="terminal-dot terminal-dot-red" />
            <span className="terminal-dot terminal-dot-amber" />
            <span className="terminal-dot terminal-dot-green" />
          </div>

          <div className="terminal-title-wrap">
            <span className="terminal-title">portfolio://boot</span>
          </div>
        </div>

        <div className="terminal-body">
          <div className="terminal-log">
            {terminalLines.map((line) => (
              <p className="terminal-line" key={line}>
                {line}
              </p>
            ))}

            {!terminalComplete ? (
              <p className="terminal-line terminal-line-active">
                {activeTerminalLine}
                <span className="terminal-cursor" />
              </p>
            ) : null}
          </div>

          {isTotalLoadDone ? (
            <div className="terminal-welcome-wrap">
              <p className="terminal-welcome">WELCOME</p>
            </div>
          ) : null}
        </div>

        <div className="terminal-footer">
          <span className="terminal-footer-label">{isTotalLoadDone ? 'ready' : 'loading'}</span>
          <div className="terminal-footer-progress" aria-live="polite">
            <span className="terminal-progress">{terminalProgressLabel}</span>
            <span className="terminal-progress-meter" aria-hidden="true">
              <span className="terminal-progress-fill" style={{ width: `${terminalProgress}%` }} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
