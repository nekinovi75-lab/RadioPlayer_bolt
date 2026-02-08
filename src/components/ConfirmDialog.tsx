import React, { useRef, useEffect } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger'
}) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            if (!dialog.open) {
                dialog.showModal();
            }
        } else {
            if (dialog.open) {
                dialog.close();
            }
        }
    }, [isOpen]);

    // Handle ESC key and backdrop clicks
    const handleCancel = (e: React.SyntheticEvent) => {
        e.preventDefault();
        onCancel();
    };

    const variantStyles = {
        danger: {
            bg: 'bg-t-danger',
            hover: 'hover:bg-t-danger-hover',
            text: 'text-t-danger',
            subtle: 'bg-t-danger-subtle',
            icon: <Trash2 className="w-6 h-6 text-t-danger" />
        },
        warning: {
            bg: 'bg-t-warning',
            hover: 'hover:bg-t-warning-hover',
            text: 'text-t-warning',
            subtle: 'bg-t-warning-subtle',
            icon: <AlertTriangle className="w-6 h-6 text-t-warning" />
        },
        info: {
            bg: 'bg-t-primary',
            hover: 'hover:bg-t-primary-hover',
            text: 'text-t-primary',
            subtle: 'bg-t-primary-subtle',
            icon: <AlertTriangle className="w-6 h-6 text-t-primary" />
        }
    };

    const style = variantStyles[variant];

    return (
        <dialog
            ref={dialogRef}
            onCancel={handleCancel}
            className="confirm-dialog backdrop:bg-[var(--overlay)] bg-transparent p-0 border-none outline-none max-w-sm w-full transition-all duration-300 backdrop:transition-opacity"
        >
            <div className="bg-t-card rounded-2xl shadow-2xl overflow-hidden border border-t-border m-4 transform scale-100 opacity-100 flex flex-col">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-full ${style.subtle} flex items-center justify-center flex-shrink-0`}>
                            {style.icon}
                        </div>
                        <h2 className="text-xl font-extrabold text-t-text">{title}</h2>
                    </div>
                    <p className="text-t-text-secondary leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="flex gap-3 p-6 pt-0">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 bg-t-card-hover hover:bg-t-border text-t-text rounded-xl font-bold transition-all border border-t-border"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onCancel();
                        }}
                        className={`flex-1 px-4 py-2.5 ${style.bg} ${style.hover} text-t-text-on-primary rounded-xl font-bold transition-all shadow-lg`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </dialog>
    );
};
