import SequenceScroll from "@/components/SequenceScroll";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Certificates from "@/components/Certificates";
import Stats from "@/components/Stats";
import GitHubContributions from "@/components/GitHubContributions";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ChatFab from "@/components/ChatFab";

export default function Home() {
  return (
    <main className="relative bg-[#050505]">
      <Navbar />

      {/* Hero: Scrollytelling Canvas */}
      <SequenceScroll />

      {/* Content sections overlap the hero */}
      <div className="-mt-[100svh] relative z-10 bg-[#050505]">
        <About />
        <Skills />
        <Projects />
        <Certificates />
        <Stats />
        <GitHubContributions />
        <Testimonials />
        <CTA />
        <Footer />
      </div>

      <ChatFab />
    </main>
  );
}
