import { ProtocolEditor } from '../components/editor/ProtocolEditor';

export function ProtocolEditorPage() {
    return (
        <div className="relative z-10">
            {/* The page itself handles the light theme background inside the editor component
                but we need to make sure it overlays cleanly if inside a dark app layout.
                Since we are in a new route, we assume full page control.
            */}
            <ProtocolEditor />
        </div>
    );
}
