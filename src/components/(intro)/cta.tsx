import Link from "next/link";
import Container from "../global/container";
import { Button } from "../ui/button";
import { Particles } from "../ui/particles";

const CTA = () => {
    return (
        <div className="flex flex-col items-center justify-center py-2 md:py-8 lg:py-10 w-full relative select-none">
            <Container>
                <div className="flex flex-col items-center justify-center text-center w-full px-4 md:px-0 mx-auto h-[500px] rounded-3xl overflow-hidden relative">
                    <div className="flex flex-col items-center justify-center w-full z-20">
                        <h2 className="text-4xl md:text-6xl font-heading heading font-semibold !leading-tight mt-6">
                            Elevate your <br className="hidden md:block" /> experience with us
                        </h2>
                        <p className="text-base md:text-lg text-center text-accent-foreground/80 max-w-xl mx-auto mt-6">
                            Ready to get started? Sign up now and start your journey with us. We are here to help you grow.
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center w-full gap-6 mt-6">
                            <Button asChild size="lg" className="w-full md:w-max">
                                <Link href="">
                                    Get Started
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="secondary" className="w-full md:w-max">
                                <Link href="">
                                    Learn More
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <Particles
                        refresh
                        ease={80}
                        color="#000"
                        quantity={100}
                        className="size-full absolute inset-0"
                    />
                </div>
            </Container>
        </div>
    )
};

export default CTA
