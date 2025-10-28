import { palette } from "./constants";

type SectionTitleProps = {
  kicker?: string;
  title: string;
  description?: string;
  kickerColor?: string;
  titleColor?: string;
  descriptionColor?: string;
  align?: "center" | "left";
};

const SectionTitle = ({
  kicker,
  title,
  description,
  kickerColor = palette.primary,
  titleColor = palette.secondary,
  descriptionColor = palette.muted,
  align = "center",
}: SectionTitleProps) => {
  const containerClass =
    align === "left"
      ? "mx-auto flex w-full max-w-3xl flex-col items-start text-left"
      : "mx-auto flex max-w-3xl flex-col items-center text-center";

  return (
    <div className={containerClass}>
      {kicker ? (
        <span
          className="mb-4 text-xs font-semibold uppercase tracking-[0.28em]"
          style={{ color: kickerColor, letterSpacing: "0.28em" }}
        >
          {kicker}
        </span>
      ) : null}
      <h2
        className="text-2xl font-semibold md:text-3xl"
        style={{ color: titleColor, fontFamily: "Poppins, sans-serif" }}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7" style={{ color: descriptionColor }}>
          {description}
        </p>
      ) : null}
    </div>
  );
};

export default SectionTitle;
