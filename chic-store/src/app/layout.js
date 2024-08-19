import Link from 'next/link';
import './global.css';
import Image from 'next/image';
import localFont from 'next/font/local'
import { Poppins } from 'next/font/google'
import { CartProvider } from "@/context/CartCountContext";
import { useCart } from '@/context/CartCountContext';
import CartBadge from "@/components/CartBadge";
import ClientLayout from '@/context/ClientLayout';

// Font files can be colocated inside of `app`
const poppins = localFont({
  src: [
    { path: '../../public/fonts/Poppins/Poppins-Thin.ttf', weight: '100', style: 'normal', },
    { path: '../../public/fonts/Poppins/Poppins-ThinItalic.ttf', weight: '100', style: 'italic', },
    { path: '../../public/fonts/Poppins/Poppins-ExtraLight.ttf', weight: '200', style: 'normal', },
    { path: '../../public/fonts/Poppins/Poppins-ExtraLightItalic.ttf', weight: '200', style: 'italic', },
    { path: '../../public/fonts/Poppins/Poppins-Light.ttf', weight: '300', style: 'normal', },
    { path: '../../public/fonts/Poppins/Poppins-LightItalic.ttf', weight: '300', style: 'italic', },
    { path: '../../public/fonts/Poppins/Poppins-Regular.ttf', weight: '400', style: 'normal', },
    { path: '../../public/fonts/Poppins/Poppins-Italic.ttf', weight: '400', style: 'italic', },
    { path: '../../public/fonts/Poppins/Poppins-Medium.ttf', weight: '500', style: 'normal', },
    { path: '../../public/fonts/Poppins/Poppins-MediumItalic.ttf', weight: '500', style: 'italic', },
    { path: '../../public/fonts/Poppins/Poppins-SemiBold.ttf', weight: '600', style: 'normal', },
    { path: '../../public/fonts/Poppins/Poppins-SemiBoldItalic.ttf', weight: '600', style: 'italic', },
    { path: '../../public/fonts/Poppins/Poppins-Bold.ttf', weight: '700', style: 'normal', },
    { path: '../../public/fonts/Poppins/Poppins-BoldItalic.ttf', weight: '700', style: 'italic', },
    { path: '../../public/fonts/Poppins/Poppins-ExtraBold.ttf', weight: '800', style: 'normal', },
    { path: '../../public/fonts/Poppins/Poppins-ExtraBoldItalic.ttf', weight: '800', style: 'italic', },
    { path: '../../public/fonts/Poppins/Poppins-Black.ttf', weight: '900', style: 'normal', },
    { path: '../../public/fonts/Poppins/Poppins-BlackItalic.ttf', weight: '900', style: 'italic', },
  ]
})



export const metadata = {
  title: 'Chic - Magazin cu articole de damă',
  description: 'Descoperă colecția noastră de articole de damă la Chic. Oferim o gamă variată de haine, accesorii și noutăți la prețuri accesibile.',
  keywords: 'chic, magazin, haine, articole damă, articole damă, haine femei, moda, modă, discount, reduceri, accesorii, bluza, bluză, bluze, camasa, cămașă, camasi, cămăși, fusta, fusta, fuste, incaltaminte, încălțăminte, palton, paltoane, pantaloni, poseta, poșetă, posete, poșete, pulover, pulovere, rochie, rochii',
  openGraph: {
    title: 'Chic - Magazin cu articole de damă',
    description: 'Descoperă colecția noastră de articole de damă la Chic. Oferim o gamă variată de haine, accesorii și noutăți la prețuri accesibile.',
    type: 'website',
    url: 'https://www.magazinchic.store', // Replace with your actual URL
    image: 'https://www.magazinchic.store/images/og-image.jpg', // Replace with your actual image URL
  },
};

const RootLayout = ({ children }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <ClientLayout>
      <html lang="ro" className={poppins.className}>
        <body className="flex flex-col min-h-screen bg-gray-200">
          <header className="bg-beige-500 w-full box-border">
            <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
              <Link href="/products">
                <Image
                  src='/images/logo.svg'
                  alt='Logo image'
                  className="mt-4"
                  width={150}
                  height={50}
                />
              </Link>
              <div className="flex">
                <Link href="/account" className='hover:bg-gray-200'>
                  <div className="flex items-center mx-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    {/* <h3 className="text-2xl font-sb mx-2">Cont</h3> */}
                  </div>
                </Link>
                <Link href="/cart" className='hover:bg-gray-200'>
                  <div className="flex items-center mx-6">
                    <CartBadge />
                    {/* <h3 className="text-2xl font-sb mx-2">Coș</h3> */}
                  </div>
                </Link>
              </div>
            </div>
          </header>

          <div className="flex-grow">{children}</div>

          <footer className="bg-beige-500 text-gray-800 p-8 mt-auto">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* First column div - has logo */}
                <div className="mx-auto">
                  <Link href="/products">
                    <Image
                      src='/images/logo.svg'
                      width={150}
                      height={50}
                      alt='logo'
                      className="mt-4"
                    />
                  </Link>
                </div>

                {/* Second column div - has contact info */}
                <div className="mx-auto">
                  <h3 className="text-lg font-bold">Contact</h3>
                  <div className="flex items-center mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    <p>chic@yahoo.com</p>
                  </div>
                  <div className="flex items-center mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                    <p>0712345678</p>
                  </div>
                  <div className="flex items-center mt-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <p>Strada, oras, judet</p>
                  </div>
                  <div className="flex items-center mt-4">
                    <Link target="_blank" href="https://www.facebook.com/MagazinChic/?locale=ro_RO" rel="noopener noreferrer">
                      <div>
                        <Image
                          src='/images/facebook.svg'
                          width={23}
                          height={23}
                          alt='Meta icon'
                          className="mr-2 max-w-[23px] max-h-[23px] transition-all duration-300 hover:filter hover:invert-[0.6] hover:sepia-[0.05] hover:saturate-[25] hover:hue-rotate-[195deg] hover:brightness-[0.9] hover:contrast-[0.9]"
                        />
                      </div>
                    </Link>
                    <Link href="https://www.wikipedia.com">
                      <Image
                        src='/images/instagram.svg'
                        width={30}
                        height={30}
                        alt='Instagram icon'
                        className="mr-2 max-w-[30px] max-h-[30px]"
                      />
                    </Link>
                  </div>
                </div>

                {/* Third column div - has help section */}
                <div className="mx-auto">
                  <h3 className="text-lg font-bold">Ajutor</h3>
                  <Link href="/account">
                    <p className="hover:bg-gray-200 hover:text-gray-700">Contul meu</p>
                  </Link>
                  <Link href="/">
                    <p className="hover:bg-gray-200 hover:text-gray-700">Formular Retur</p>
                  </Link>
                </div>

                {/* Fourth column div - has extra/other info */}
                <div className="mx-auto">
                  <h3 className="text-lg font-bold">Info</h3>
                  <Link href="/">
                    <p className="hover:bg-gray-200 hover:text-gray-700">Termene și condiții</p>
                  </Link>
                  <Link href="/">
                    <p className="hover:bg-gray-200 hover:text-gray-700">Modalități Plată</p>
                  </Link>
                  <Link href="/">
                    <p className="hover:bg-gray-200 hover:text-gray-700">Livrare și retur</p>
                  </Link>
                  <Link href="/">
                    <p className="hover:bg-gray-200 hover:text-gray-700">Despre noi</p>
                  </Link>
                  <Image
                    src='/images/image.png'
                    width={150}
                    height={50}
                    alt="Payment provider logo"
                    className="mt-4"
                  />
                </div>
              </div>
              <p className="text-center mb-2 mt-4 text-xs">Chic&#169; {currentYear}</p>
            </div>
          </footer>
        </body>
      </html>
    </ClientLayout>
  );
}

export default RootLayout;