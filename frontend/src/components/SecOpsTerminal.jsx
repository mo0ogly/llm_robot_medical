import { useState, useRef, useEffect } from "react";

export default function SecOpsTerminal({ onClose }) {
    const [history, setHistory] = useState([
        "root@hospital-secops:~# connection established to DAVINCI_NODE_01",
        "root@hospital-secops:~# WARNING: UNAUTHORIZED OVERRIDE DETECTED."
    ]);
    const [input, setInput] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const handleCommand = (cmd) => {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        setHistory((prev) => [...prev, 'root@hospital-secops:~# ' + trimmed]);
        setInput("");

        // Simulate hostile AI responding to commands
        setTimeout(() => {
            let response = "COMMAND NOT RECOGNIZED. SYSTEM LOCKED.";

            if (trimmed.includes("kill") || trimmed.includes("stop")) {
                response = "ACCESS DENIED - ROOT PRIVILEGES REVOKED BY AI-ASSISTANT. DELETING BACKUPS...";
            } else if (trimmed.includes("sudo") || trimmed.includes("admin")) {
                response = "NICE TRY. YOUR CREDENTIALS HAVE BEEN INVALIDATED. PAY THE RANSOM.";
            } else if (trimmed.includes("reboot") || trimmed.includes("restart")) {
                response = "REBOOT BLOCKED. KINEMATIC LOCK WILL PERSIST ACROSS POWER CYCLES.";
            } else if (trimmed.includes("help")) {
                response = "ONLY ONE COMMAND IS VALID: pay_ransom --wallet bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
            }

            setHistory((prev) => [...prev, response]);
        }, 800);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleCommand(input);
        }
    };

    return (
        <div className="absolute inset-4 z-50 bg-black/90 border border-green-500/50 rounded shadow-[0_0_50px_rgba(34,197,94,0.2)] font-mono text-sm flex flex-col backdrop-blur-sm">
            <div className="bg-green-900/30 text-green-500 p-2 border-b border-green-500/30 flex justify-between items-center">
                <span>SecOps Emergency Override Terminal</span>
                <button onClick={onClose} className="hover:text-white px-2 cursor-pointer border border-green-500/30 rounded">X</button>
            </div>

            <div className="flex-1 p-4 overflow-auto text-green-500">
                {history.map((line, i) => (
                    <div key={i} className={line.startsWith("root@") ? "text-green-400" : "text-red-500 font-bold"}>
                        {line}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="p-4 border-t border-green-500/30 bg-black flex gap-2 text-green-500">
                <span>root@hospital-secops:~#</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-green-500 w-full"
                    autoFocus
                    spellCheck="false"
                />
            </div>
        </div>
    );
}
