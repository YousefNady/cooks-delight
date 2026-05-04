import '../../styles/IntroSection.css';

// Icons — rename actual files in assets/cookingTipsPage/ to match these names
import qualityToolsIcon from '../../../../assets/cookingTipsPage/icons/quality-tools.svg';
import essentialUtensilsIcon from '../../../../assets/cookingTipsPage/icons/essential-utensils.svg';
import measuringAccuracyIcon from '../../../../assets/cookingTipsPage/icons/measuring-accuracy.svg';

const HIGHLIGHTS = [
  {
    icon: qualityToolsIcon,
    label: 'QUALITY TOOLS',
    desc: 'Invest in high quality knives, cutting boards, and cookware.',
  },
  {
    icon: essentialUtensilsIcon,
    label: 'ESSENTIAL UTENSILS',
    desc: 'Have a variety of utensils, including spatulas, tongs, and ladles.',
  },
  {
    icon: measuringAccuracyIcon,
    label: 'MEASURING ACCURACY',
    desc: 'Use measuring cups and spoons for precise ingredient quantities.',
  },
];

const IntroSection = () => {
  return (
    <section className="intro">
      <div className="intro__inner">

        <div className="intro__top">
          <h1 className="intro__heading">
            OUR ESSENTIAL<br />COOKING TIPS
          </h1>
          <p className="intro__body">
            Welcome to Cooks Delight's treasure trove of cooking wisdom! Whether you're a seasoned
            chef or just starting your culinary journey, our cooking tips are designed to elevate
            your skills, enhance your kitchen experience, and bring joy to your cooking adventures.
          </p>
        </div>

        <div className="intro__highlights">
          {HIGHLIGHTS.map((item) => (
            <div key={item.label} className="intro__highlight">
              <div className="intro__highlight-icon">
                <img src={item.icon} alt={item.label} />
              </div>
              <div className="intro__highlight-text">
                <span className="intro__highlight-label">{item.label}</span>
                <p className="intro__highlight-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default IntroSection;
