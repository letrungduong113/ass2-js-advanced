import "./style.css";
export const ImagePreview = ({
  imgData,
  handleRemove,
}: {
  imgData: string | undefined;
  handleRemove: () => void;
}) => {
  return (
    <div className="wrp-img-pr">
      <img className="img-preview" src={imgData} />
      <div onClick={handleRemove} className="close"></div>
    </div>
  );
};
