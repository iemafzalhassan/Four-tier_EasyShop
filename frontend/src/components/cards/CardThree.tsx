"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartWrapper from "@/components/AddToCartWrapper";
import { discountPercent } from "@/lib/utils";
import { formatPrice } from "@/utils/format";
import { TbCurrencyTaka } from "react-icons/tb";

const CardThree = ({
  _id,
  title,
  price,
  image,
  oldPrice,
  unit_of_measure,
  shop_category,
}: AllProduct) => {
  return (
    <div className="bakery-card bg-secondary p-3 md:p-4 rounded-lg relative hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
      {/* discount */}
      {oldPrice && (
        <p className="discount absolute top-3 right-3 sm:top-5 sm:right-5 text-xs px-2 py-1 rounded-md bg-green-600 text-white">
          -{discountPercent(price, oldPrice)}
        </p>
      )}
      <Link href={`/products/${_id}`}>
        <div className="img">
          <Image
            src={image[0]}
            width={500}
            height={500}
            alt={title}
            className="bg-accent rounded-sm"
          />

          <div className="content mt-2 font-semibold">
            <h2
              className="line-clamp-1 text-gray-700 dark:text-gray-300"
              title={title}
            >
              {title}
            </h2>
          </div>
        </div>
      </Link>
      <div className="flex flex-col gap-2.5 justify-between mt-2">
        <p className="flex gap-2 items-end">
          <span className="">{formatPrice(price)}</span>
          {oldPrice && (
            <del className="text-sm text-gray-400">{formatPrice(oldPrice)}</del>
          )}
        </p>
        <AddToCartWrapper
          cartItem={{
            _id,
            title,
            image: image[0],
            price,
            unit_of_measure,
            shop_category,
          }}
        />
      </div>
    </div>
  );
};

export default CardThree;
