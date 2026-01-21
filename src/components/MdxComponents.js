import Image from 'next/image';
import ResultsHighlight from './ResultsHighlight';

// Custom component to replace the default <img> tag in MDX content
const MdxImage = (props) => (
  <span className="block my-8">
    <Image
      width={850} // Default width
      height={550} // Default height
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 850px"
      style={{ width: '100%', height: 'auto' }}
      quality={90}
      {...props}
      alt={props.alt || ''}
      className="rounded-lg shadow-lg mx-auto"
    />
  </span>
);

export const mdxComponents = {
  img: MdxImage,
  ResultsHighlight,
  // You can add other custom components here as well
};