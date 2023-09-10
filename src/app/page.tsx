import Link from "next/link";

import Logo from "@/svgs/logo";

export default function Landing() {


   return <div>
      <nav className="flex justify-between items-center p-3 border-b-2 border-text-color">
         <div  className="flex justify-evenly">
            <div>
               <Logo isDark={false} /* edit isDark later */ /> 
            </div>
            <h2 className="text-3xl ml-3">Chatty</h2>
         </div>
         <div className="flex justify-evenly">
            <Link href="#footer">Contact Us</Link>
            <Link href="/login">Log In</Link>
         </div>
      </nav>
      <main>
         <h1>Stay Connected with Chatty: The fun and secure way to connect</h1>
         <p>Message your friends and family easily and choose your character to be whoever you want.</p>
      </main>
      <section>
         <div>
            <div><img src="/images/illustrations/Voice chat-amico.svg" alt="Chating image"/></div>
            <p>Fast and easy chat with anyone around the world</p>
         </div>
         <div>
            <p>Choose your avatar from 25+ design</p>
            <div><img src="/images/illustrations/Personalization-pana (2).svg" alt="Choose avatar image" /></div>
         </div>
         <div>
            <div><img src="/images/illustrations/Safe-rafiki (2).svg" alt="Secure safe image" /></div>
            <p>Save your files in a chat securely </p>
         </div>
      </section>
      <section>
         <h3>Get in the website and start messaging now</h3>
         <Link href="/login">Log In</Link>
      </section>
      <footer id="footer">
         <h3>By Abdullah Salah</h3>
         <p>Email: <a href="mailto:asr12211@outlook.com">mailto:asr12211@outlook.com</a></p>
         <p>Phone: +964 0771 382 1672</p>
         <p>GitHub: <a href="https://github.com/ASR1221">ASR1221</a></p>
         <p>Linked In: <a href="https://www.linkedin.com/in/abdullah-salah-29209b235/">Abdullah Salah</a></p>
      </footer>
   </div>
}