import Image from 'next/image';
import ResultsHighlight from './ResultsHighlight';

// Custom component to replace the default <img> tag in MDX content
const MdxImage = (props) => (
  <div className="my-8">
    <Image
      width={800} // Default width, can be overridden in MDX
      height={500} // Default height, can be overridden in MDX
      {...props}
      alt={props.alt || ''}
      className="rounded-lg shadow-lg mx-auto"
    />
  </div>
);

export const mdxComponents = {
  img: MdxImage,
  ResultsHighlight,
  // You can add other custom components here as well
};