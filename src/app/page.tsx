import Navbar from "@/components/(intro)/Navbar";
import Footer from "@/components/(intro)/footer";
import Background from "@/components/global/background";
import Wrapper from "@/components/global/wrapper";
import Container from "@/components/global/container";
import Hero from "@/components/(intro)/hero";
import Companies from "@/components/(intro)/companies";
import Reviews from "@/components/(intro)/reviews";
import CTA from "@/components/(intro)/cta";
import Perks from "@/components/(intro)/perks";

export default function Home() {
  return (
    <>
      <div id="home" className="absolute inset-0 bg-[linear-gradient(to_right,rgba(23,23,23,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,23,23,0.4)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] h-full mt-[63px opacity-20" />
      <Navbar />
      <main className="mx-auto w-full z-40 relative">
        <Background>
          <Wrapper className="py-20 relative">
            <Container className="relative">
              <Hero />
            </Container>
            <Container className="py-8 lg:py-10">
              <Companies />
            </Container>
            <Perks />
            <Reviews />
            <CTA />
          </Wrapper>
        </Background>
      </main>
      <Footer />
    </>
  );
};
