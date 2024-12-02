import { PERKS } from "@/constants";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Container from "../global/container";
import { SectionBadge } from "../ui/section-bade";

const Perks = () => {
    return (
        <div className="flex flex-col items-center justify-center py-12 md:py-16 lg:py-24 w-full select-none">
            <Container>
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                    <SectionBadge title="Perks" />
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading font-medium !leading-snug mt-6">
                        Discover the benefits
                    </h2>
                    <p className="text-base md:text-lg text-center text-accent-foreground/80 mt-6">
                        Explore the powerful features and advantages that NextHireAI offer to help you get job ready
                    </p>
                </div>
            </Container>
            <Container>
                <div className="mt-16 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full relative">
                        {PERKS.map((perk, index) => (
                            <Perk key={index} index={index} {...perk} />
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
};

const Perk = ({
    title,
    description,
    color,
    bgColor,
    icon: Icon,
}: {
    title: string;
    description: string;
    color: string;
    bgColor: string;
    icon: LucideIcon;
    index: number;
}) => {
    return (
        <div
            className="flex flex-col rounded-xl border transform-gpu py-10 relative group/feature bg-gray-50/10 hover:bg-gray-100/70"
        >
            <div className="group-hover/feature:-translate-y-1 transform-gpu transition-all duration-300 flex flex-col w-full">
                <div className="mb-4 relative z-10 px-10">
                    <Icon
                        strokeWidth={1.3}
                        className={cn(
                            "w-10 h-10 origin-left transform-gpu transition-all duration-300 ease-in-out",
                            "text-black",
                            color && `group-hover/feature:${color}`
                        )}
                    />
                </div>
                <div className="text-lg font-medium font-heading mb-2 relative z-10 px-10">
                    <div className={cn(
                        "absolute left-0 -inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full transition-all duration-500 origin-center",
                        "bg-neutral-700",
                        bgColor && `${bgColor}`
                    )} />
                    <span className="group-hover/feature:-translate-y- group-hover/feature:text- transition duration-500 inline-block heading">
                        {title}
                    </span>
                </div>
                <p className="text-sm text-black/60 max-w-xs relative z-10 px-10 font-medium">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default Perks
