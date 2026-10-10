import SequenceScroll from "@/components/SequenceScroll";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Certificates from "@/components/CertificatesDrift";
import Stats from "@/components/Stats";
import GitHubContributions from "@/components/GitHubContributions";
import Terminal from "@/components/Terminal";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ChatFab from "@/components/ChatFab";
import ClickSpark from "@/components/ClickSpark";

export default function Home() {
  return (
    <ClickSpark
      sparkColor="#ffffff"
      sparkSize={10}
      sparkRadius={16}
      sparkCount={8}
      duration={400}
    >
      <main className="relative bg-[#050505]">
      <Navbar />

      {/* Hero: Scrollytelling Canvas */}
      <SequenceScroll />

      {/* Content sections overlap the hero */}
      <div className="-mt-[100svh] relative z-10 bg-[#050505]">
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certificates />
        <Stats />
        <GitHubContributions />
        <Terminal />
        <CTA />
        <Footer />
      </div>

      <ChatFab />
      </main>
    </ClickSpark>
  );
}
