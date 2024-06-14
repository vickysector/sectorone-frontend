import clsx from "clsx";

export const DetailDescriptions = ({ section }) => {
  return (
    <>
      <h1 className={clsx("mt-4 mb-2")}>Prevention recommendations</h1>
      <ol style={{ listStyleType: "decimal" }}>
        <li className={clsx("list-item ml-5")}>Immediate credential change</li>
      </ol>
    </>
  );
};
