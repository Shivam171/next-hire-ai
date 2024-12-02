import React from 'react'

interface Props {
    title: string;
}

export const SectionBadge = ({ title }: Props) => {
    return (
        <div className="px-4 py-1 rounded-full bg-primary/10 cursor-pointer select-none">
            <div className="text-black  font-medium text-sm">
                {title}
            </div>
        </div>
    )
};
