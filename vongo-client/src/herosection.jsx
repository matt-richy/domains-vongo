import React from 'react';
import './herosection.css';
import refimage1 from './photos/bottles/reflectionMobile.jpeg';
import image2 from './photos/bottles/heroimage2.jpeg'
import durable from './photos/bottles/durable.jpeg';

const HeroSection = () => {
    const sellingPoints = [
      {
        text: 'Stay Hot, Stay Cold—All Day Long!',
        description: 'Double-wall insulation keeps your drinks at the perfect temperature for hours.',
        image: refimage1,
      },
      {
        text: '1.9L Capacity—No More Refills!',
        description: 'Perfect for long trips or sharing with the family—no need to refill.',
        image: image2,
      },
      {
        text: 'Built for a lifetime',
        description: "Vongo flasks are made from premium .304 grade stainless steel for both inner and outer walls, ensuring durability that lasts for years.",
        image: durable,
      },
    ];
  
    return (
      <div className="hero-scroll-container">
        {sellingPoints.map((point, index) => (
          <div
            className={`hero-section ${index === 1 ? 'text-over-image' : ''}`}
            key={index}
          >
            {/* Text */}
            <div className="text-container">
              <h1 className="hero-text">{point.text}</h1>
              <p className="hero-description">{point.description}</p>
            </div>
            {/* Image */}
            <div className="image-container">
              <img
                src={point.image}
                alt={`Vongo Flask Feature ${index + 1}`}
                className="feature-image"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default HeroSection;