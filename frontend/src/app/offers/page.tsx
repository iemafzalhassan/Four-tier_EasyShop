import { Metadata } from "next";
import Image from "next/image";

const offers = [
  {
    imgUrl: "/assets/images/banners/offers/offer1.png",
  },
  {
    imgUrl: "/assets/images/banners/offers/offer2.png",
  },
  {
    imgUrl: "/assets/images/banners/offers/offer3.png",
  },
  {
    imgUrl: "/assets/images/banners/offers/offer4.png",
  },
  {
    imgUrl: "/assets/images/banners/offers/offer5.png",
  },
  {
    imgUrl: "/assets/images/banners/offers/offer6.png",
  },
];

export const metadata: Metadata = {
  title: "Offers",
  description:
    "EasyShop is the user-friendly Next.js eCommerce template perfect for launching your online store. With its clean design and customizable options, EasyShop makes selling online a breeze. Start building your dream store today and boost your online presence effortlessly!",
};

const OffersPage = () => {
  return (
    <section className="offer-page pt-10 pb-16">
      <h1 className="text-center text-4xl font-semibold mb-6">Special Offers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-[990px] px-default gap-4 lg:gap-5 mx-auto">
        {offers.map((offer) => (
          <div key={offer.imgUrl} className="bg-secondary rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <Image
              src={offer.imgUrl}
              width={600}
              height={400}
              alt="Special offer"
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default OffersPage;
