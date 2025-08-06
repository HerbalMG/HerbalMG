// import React from "react";

// const About = () => {
//   return (

//     <div
//       className="min-h-screen bg-no-repeat bg-center bg-cover"
//       style={{
//         backgroundImage: `url("/assets/leaf.svg")`,
//         // backgroundSize: "cover",
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "center",
//         opacity: 1,

//       }}
//     >
//       {/* Overlay to make content readable if needed */}
//       <div className=" bg-opacity-10 min-h-screen">
//         {/* Top Section */}
//         <div className="text-black py-12 px-6 text-center font-serif">
//           <h1 className="text-4xl font-bold">Welcome to HerbalMG</h1>
//           <p className="mt-2 text-lg">Your trusted source for natural wellness</p>
//         </div>

//         {/* Two Columns */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 py-12 max-w-6xl mx-auto">
//           {/* Left Column */}
//           <div>
//             <h2 className="text-2xl font-semibold text-gray-800 mb-2">Our MISSION</h2>
//             <p className="text-gray-500 leading-relaxed ">
//               At HerbalMG, we believe in the profound healing power of nature. Our
//             mission is to enhance lives through high-quality herbal remedies
//             that support holistic health, inner balance, and overall well-being.
//             We are committed to using time-honored traditions alongside modern
//             scientific research to craft natural products that are not only
//             effective but also safe and ethically sourced. Every ingredient we
//             use is carefully selected, and every formula is thoughtfully
//             designed to nurture the body, mind, and spirit. Through
//             transparency, sustainability, and genuine care, we strive to be a
//             trustworthy partner on your journey to wellness.
//             </p>

//             <h2 className="text-2xl font-semibold text-gray-800 mt-4">Our VISION</h2>
//             <p className="text-gray-500 leading-relaxed">
//               Our vision is to be a global leader in herbal wellness, inspiring a
//             return to nature’s wisdom in health and healing. We envision a world
//             where people turn to natural, sustainable remedies as their first
//             choice for well-being—guided by knowledge, empowered by quality, and
//             connected through shared respect for the Earth. Through education,
//             innovation, and compassion, we aim to build a healthier future where
//             herbal healing is trusted, accessible, and integrated into daily
//             life.
//             </p>
//           </div>

//           {/* Right Column */}
//           <div>
//             <h2 className="text-2xl font-semibold text-gray-800 mb-2">ABOUT US</h2>
//             <p className="text-gray-500 leading-relaxed">
//              HerbalMG began as a humble family-owned business rooted in
//             generations of knowledge and respect for natural healing. What
//             started in a small home kitchen with a handful of herbal recipes has
//             now grown into a nationally trusted brand, serving thousands of
//             loyal customers who believe in natural, plant-based solutions for
//             health.
//             </p>
//             <p className="text-gray-500 leading-relaxed mt-2">
//               Despite our growth, we’ve never lost sight of our roots. We continue
//             to uphold the values that inspired our founding: integrity,
//             tradition, and a deep respect for nature. Our team includes
//             herbalists, researchers, and wellness experts who work hand-in-hand
//             to create safe, effective, and accessible remedies for everyday
//             wellness. By blending ancient herbal wisdom with the latest
//             scientific advancements, we ensure our products meet the highest
//             standards of quality, safety, and efficacy.
//             </p>
//             <p className="text-gray-500 leading-relaxed mt-2">
//               At HerbalMG, we don’t just sell products—we foster a lifestyle
//             grounded in nature, healing, and harmony.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default About;

import React from "react";

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Top Section */}
      <div className=" text-black text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700">
          ABOUT US
        </h1>
        <p className="text-base sm:text-lg md:text-xl mt-2 text-orange-500">
          Welcome to HerbalMG, India’s trusted platform for Ayurvedic and herbal
          medicines from top companies.
        </p>
      </div>

      <div className="gap-8 px-6 max-w-6xl  mt-2 mx-auto">
        <p className="text-gray-800 leading-relaxed mt-2 font-semibold">
          At HerbalMG, we don’t manufacture our own products — we bring you a
          curated selection of authentic Ayurvedic and herbal medicines from
          top-rated, trusted brands in India. Our platform makes it easy to buy
          Ayurvedic medicine online — safely, conveniently, and affordably.
        </p>

        <p className="text-gray-800 leading-relaxed mt-2 font-semibold">
          We work only with reputed Ayurvedic and herbal companies to ensure
          that every product listed on HerbalMG meets the highest standards of
          quality, purity, and authenticity. Whether you’re looking for daily
          wellness supplements, natural remedies for chronic conditions, or
          traditional herbal solutions, you’ll find them all here in one place.
        </p>

        <p className="text-gray-800 leading-relaxed mt-2 font-semibold">
          Our goal is simple: to make genuine herbal products easily accessible
          across India. With a user-friendly platform and reliable delivery, we
          make natural healthcare simple and trustworthy.
        </p>

        <ul className="text-gray-800 leading-relaxed mt-2 font-semibold">
          Why Choose HerbalMG?
          <div>
            <li className="text-gray-500 ">
            1. 100% authentic Ayurvedic medicines
            </li>
            <li className="text-gray-500 ">
              2. Sourced only from trusted herbal brands
            </li>
            <li className="text-gray-500 ">
              3. Affordable prices & doorstep delivery
            </li>
            <li className="text-gray-500 ">
              4. Wide range of herbal health solutions
            </li>
            <li className="text-gray-500">
              5. Safe, secure, and easy to order online
            </li>
          </div>
        </ul>

        <p className="text-gray-800 leading-relaxed mt-2 font-semibold">
          At HerbalMG, we don’t create products — we deliver trust. Shop
          confidently and experience the power of natural Ayurvedic healing
          today.
        </p>
      </div>

      {/* Two Columns */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 max-w-6xl  mt-2 mx-auto">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-green-600 mb-2 ">
            ABOUT US
          </h2>
          <p className="text-gray-500 leading-relaxed">
            HerbalMG began as a humble family-owned business rooted in
            generations of knowledge and respect for natural healing. What
            started in a small home kitchen with a handful of herbal recipes has
            now grown into a nationally trusted brand, serving thousands of
            loyal customers who believe in natural, plant-based solutions for
            health.{" "}
          </p>
          <p className="text-gray-500 leading-relaxed mt-2">
            Despite our growth, we’ve never lost sight of our roots. We continue
            to uphold the values that inspired our founding: integrity,
            tradition, and a deep respect for nature. Our team includes
            herbalists, researchers, and wellness experts who work hand-in-hand
            to create safe, effective, and accessible remedies for everyday
            wellness. By blending ancient herbal wisdom with the latest
            scientific advancements, we ensure our products meet the highest
            standards of quality, safety, and efficacy.
          </p>

          <p className="text-gray-500 leading-relaxed mt-2">
            At HerbalMG, we don’t just sell products—we foster a lifestyle
            grounded in nature, healing, and harmony.
          </p>
        </div>
        

        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-green-600 mb-2">
            Our MISSION
          </h2>
          <p className="text-gray-500 leading-relaxed">
            At HerbalMG, we believe in the profound healing power of nature. Our
            mission is to enhance lives through high-quality herbal remedies
            that support holistic health, inner balance, and overall well-being.
            We are committed to using time-honored traditions alongside modern
            scientific research to craft natural products that are not only
            effective but also safe and ethically sourced. Every ingredient we
            use is carefully selected, and every formula is thoughtfully
            designed to nurture the body, mind, and spirit. Through
            transparency, sustainability, and genuine care, we strive to be a
            trustworthy partner on your journey to wellness.
          </p>

          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-green-600 mt-4">
            Our VISION
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Our vision is to be a global leader in herbal wellness, inspiring a
            return to nature’s wisdom in health and healing. We envision a world
            where people turn to natural, sustainable remedies as their first
            choice for well-being—guided by knowledge, empowered by quality, and
            connected through shared respect for the Earth. Through education,
            innovation, and compassion, we aim to build a healthier future where
            herbal healing is trusted, accessible, and integrated into daily
            life.
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default About;
