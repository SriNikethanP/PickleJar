type LineItemOptionsProps = {
  product: any;
  "data-value"?: any;
};

const LineItemOptions = ({ product }: LineItemOptionsProps) => {
  return (
    <div className="text-small-regular text-gray-700">
      <span>{product.name}</span>
    </div>
  );
};

export default LineItemOptions;
