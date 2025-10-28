import { palette } from "./constants";

type SectionTitleProps = {
  kicker?: string;
  title: string;
  description?: string;
};

const SectionTitle = ({ kicker, title, description }: SectionTitleProps) => (
  <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
    {kicker ? (
      <span
        className="mb-4 text-xs font-semibold uppercase tracking-[0.28em]"
        style={{ color: palette.primary, letterSpacing: "0.28em" }}
      >
        {kicker}
      </span>
    ) : null}
    <h2
      className="text-2xl font-semibold md:text-3xl"
      style={{ color: palette.secondary, fontFamily: "Poppins, sans-serif" }}
    >
      {title}
    </h2>
    {description ? (
      <p className="mt-4 text-base leading-7" style={{ color: palette.muted }}>
        {description}
      </p>
    ) : null}
  </div>
);

export default SectionTitle;
