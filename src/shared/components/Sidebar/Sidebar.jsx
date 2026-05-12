import { useState } from "react";
import {
    GridViewIcon,
    UserMultipleIcon,
    Calendar01Icon,
    File01Icon,
    Building04Icon,
    PanelLeftOpenIcon, ArrowLeft01Icon,
} from "hugeicons-react";
import "./Sidebar.css";

const NAV = [
    { icon: GridViewIcon,     label: "Dashboard"  },
    { icon: UserMultipleIcon, label: "Employees"  },
    { icon: Calendar01Icon,   label: "Attendance" },
    { icon: File01Icon,     label: "Leave"      },
    { icon: Building04Icon,   label: "Department" },
];

export default function Sidebar() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [tooltip, setTooltip] = useState(null); // { label, y }

    const showTooltip = (e, label) => {
        if (isExpanded) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({ label, y: rect.top + rect.height / 2 });
    };

    const hideTooltip = () => setTooltip(null);

    return (
        <div className={`sb-wrapper${isExpanded ? " expanded" : ""}`}>
            <div className={`sb-sidebar${isExpanded ? " expanded" : ""}`}>
                <div className="sb-header">
    <div className="sb-logo-area">
        <img src="/logo.svg" alt="Logo" className="sb-logo-icon" />
    </div>

    {/* NEW: Inside toggle button (shows only when expanded) */}
    <button
        className="sb-header-toggle"
        onClick={() => { setIsExpanded(false); hideTooltip(); }}
        aria-label="Collapse sidebar"
    >
        <PanelLeftOpenIcon size={20} />
    </button>

    <img
        src="/logo1.svg"
        alt="Logo"
        className="sb-logo-collapsed"
        onClick={() => { setIsExpanded(true); hideTooltip(); }}
    />
</div>

                {/* ── Nav ── */}
                <div className="sb-scroll">
                    <ul className="sb-menu">
                        {NAV.map(({ icon: Icon, label }) => (
                            <li
                                className="sb-menu-item"
                                key={label}
                                onMouseEnter={(e) => showTooltip(e, label)}
                                onMouseLeave={hideTooltip}
                            >
                                <div className="sb-item-header">
                                    <span className="sb-icon-wrap">
                                        <Icon size={20} />
                                    </span>
                                    <span className="sb-item-text">{label}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            {/* ── Toggle btn — right edge of sidebar ── */}
            <button
                className="sb-toggle-btn"
                onClick={() => { setIsExpanded((p) => !p); hideTooltip(); }}
                aria-label="Toggle sidebar"
            >
                <ArrowLeft01Icon size={14} />
            </button>

            {/* ── Tooltip — fixed, escapes sidebar overflow ── */}
            {tooltip && (
                <div
                    className="sb-tooltip"
                    style={{ top: tooltip.y }}
                >
                    {tooltip.label}
                </div>
            )}
        </div>
    );
}