import React from "react";

const About = () => {
  return (
    <>
      <section
        className="p-8 overflow-hidden  bg-white dark:bg-dark lg:pb-20 lg:pt-[50px]"
        style={{
          background:
            "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
        }}
      >
        <div className="mx-auto mb-[60px] max-w-[520px] text-center lg:mb-20">
          <h2 className="mb-4 text-blue-400 text-3xl font-bold text-dark text-Black sm:text-[40px]/[48px]">
            About MediVerse
          </h2>
        </div>

        <div className="container mx-auto">
          <div className="flex flex-wrap items-center justify-between -mx-4">
            <div className="w-full px-4 lg:w-6/12">
              <div className="flex items-center -mx-3 sm:-mx-4">
                <div className="w-full px-3 sm:px-4 xl:w-1/2">
                  <div className="py-3 sm:py-4">
                    <img
                      src="https://i.ibb.co/gFb3ns6/image-1.jpg"
                      alt=""
                      className="w-full rounded-2xl"
                    />
                  </div>
                  <div className="py-3 sm:py-4">
                    <img
                      src="https://i.ibb.co/rfHFq15/image-2.jpg"
                      alt=""
                      className="w-full rounded-2xl"
                    />
                  </div>
                </div>
                <div className="w-full px-3 sm:px-4 xl:w-1/2">
                  <div className="relative z-10 my-4">
                    <img
                      src="https://i.ibb.co/9y7nYCD/image-3.jpg"
                      alt=""
                      className="w-full rounded-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2 xl:w-5/12">
              <div className="mt-10 lg:mt-0">
                <span className="block mb-4 text-lg font-semibold text-primary">
                  Make your customers happy by giving services.
                </span>
                <p className="mb-5 text-base text-body-color dark:text-dark-6">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum is that it has a more-or-less.
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Minima hic autem deserunt placeat maiores, nulla laboriosam
                  voluptatum modi dicta explicabo alias minus vitae nemo
                  similique nostrum obcaecati consequuntur et soluta qui. Iste
                  reprehenderit rerum cum facere blanditiis. Praesentium est
                  quisquam neque, cupiditate tempora veritatis aut reiciendis
                  consectetur, natus quibusdam laborum nihil sunt itaque facilis
                  ipsum optio possimus doloribus minus atque? Sit, vitae
                  consequatur architecto nemo neque quis nesciunt atque, cumque
                  corrupti perspiciatis numquam quaerat accusantium qui
                  molestiae? Praesentium, dolor quam animi, soluta, rerum
                  delectus incidunt suscipit aperiam non voluptatum totam!
                  Veritatis esse beatae repudiandae incidunt veniam excepturi,
                  odit delectus eum. Lorem ipsum dolor sit amet consectetur,
                  adipisicing elit. Totam, natus itaque omnis veniam nisi
                  consectetur sequi molestias id, maxime reprehenderit cumque
                  eligendi reiciendis possimus ad dignissimos! Quo veniam facere
                  at eligendi exercitationem neque nesciunt saepe veritatis.
                  Debitis voluptatem eveniet in placeat unde nostrum dolores
                  natus. Expedita odio qui porro perferendis iure? Alias libero
                  sit mollitia saepe incidunt sequi consectetur natus? Fugiat
                  necessitatibus quo, culpa temporibus odio voluptatibus iste ex
                  commodi, voluptate quaerat quas ipsum ipsam. Consequatur non
                  ratione incidunt illum a doloremque sed minus molestias
                  commodi aspernatur illo deleniti libero unde ipsam tempore
                  dolore odit quas placeat, eaque hic doloribus!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
