import './GallerySection.css';
import gallery1 from '../../../assets/aboutUs/gallery/gallery-1.jpg';
import gallery2 from '../../../assets/aboutUs/gallery/gallery-2.jpg';
import gallery3 from '../../../assets/aboutUs/gallery/gallery-3.jpg';
import gallery4 from '../../../assets/aboutUs/gallery/gallery-4.jpg';
import gallery5 from '../../../assets/aboutUs/gallery/gallery-5.jpg';
import gallery6 from '../../../assets/aboutUs/gallery/gallery-6.jpg';
import gallery7 from '../../../assets/aboutUs/gallery/gallery-7.jpg';
import gallery8 from '../../../assets/aboutUs/gallery/gallery-8.jpg';

const GALLERY_IMAGES = [
{ id: 1, src: gallery1, alt: "Chefs plating food in a professional kitchen" },
  { id: 2, src: gallery2, alt: "Isabella chopping fresh vegetables" },
  { id: 3, src: gallery3, alt: "Chef smelling the rich aroma of a cooking dish" },
  { id: 4, src: gallery4, alt: "Close-up of a gourmet dish being garnished" },
  { id: 5, src: gallery5, alt: "Adding spices to a hot pan on the stove" },
  { id: 6, src: gallery6, alt: "Chopped peppers and a chef's knife on a cutting board" },
  { id: 7, src: gallery7, alt: "Chef's hands clapping with flour dust in the air" },
  { id: 8, src: gallery8, alt: "Taking a smartphone photo of a bowl of soup" }
];

const GallerySection = () => {
  return (
    <section className="gallery">
      <div className="gallery__grid">
        {GALLERY_IMAGES.map((img, i) => (
          <div key={i} className="gallery__item">
            <img
              src={img.src}
              alt={img.alt}
              className="gallery__img"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default GallerySection;