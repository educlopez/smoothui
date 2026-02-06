import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion } from "motion/react";

interface MenuIllustrationProps {
  activeSection: string;
  className?: string;
}

// Components MenuIllustration - for text, basic, components
export function MenuIllustration({
  activeSection,
  className = "",
}: MenuIllustrationProps) {
  return (
    <motion.svg
      animate={{ opacity: 1 }}
      aria-label={`Menu illustration for ${activeSection} section`}
      className={cn(className, "overflow-hidden rounded-md")}
      fill="none"
      height="231"
      initial={{ opacity: 0 }}
      role="img"
      style={{ overflow: "hidden" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      viewBox="0 0 231 231"
      width="231"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="clip0_components">
          <rect height="231" rx="7.22" width="231" />
        </clipPath>
      </defs>
      <g clipPath="url(#clip0_components)" id="components">
        {/* Common background - always visible */}
        <path
          className="fill-brand-secondary"
          d="M223.781 0H7.21875C3.23194 0 0 3.23194 0 7.21875V223.781C0 227.768 3.23194 231 7.21875 231H223.781C227.768 231 231 227.768 231 223.781V7.21875C231 3.23194 227.768 0 223.781 0Z"
          id="Vector"
        />

        {/* Text section - animated g group */}
        <motion.g
          animate={{
            opacity: activeSection === "text" ? 1 : 0,
            y: activeSection === "text" ? 0 : 20,
          }}
          id="text"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <rect
            height="45"
            id="text1"
            rx="22.5"
            style={{ fill: "var(--color-brand)" }}
            width="188"
            x="-31"
            y="8"
          />
          <rect
            height="45"
            id="text2"
            rx="22.5"
            style={{ fill: "var(--color-brand-light)" }}
            width="226"
            x="-31"
            y="63"
          />
          <rect
            height="45"
            id="text3"
            rx="22.5"
            style={{ fill: "var(--color-brand-lighter)" }}
            width="188"
            x="-31"
            y="122"
          />
          <rect
            height="45"
            id="text4"
            rx="22.5"
            style={{ fill: "var(--color-brand)" }}
            width="226"
            x="-31"
            y="177"
          />
        </motion.g>

        {/* Basic section - animated g group */}
        <motion.g
          animate={{
            opacity: activeSection === "basic" ? 1 : 0,
            y: activeSection === "basic" ? 0 : 20,
          }}
          id="basics"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <path
            d="M55.6157 166.27C44.7837 160.016 39.3678 156.889 37.3388 153.283C35.5538 150.112 35.5538 146.695 37.3388 143.524C39.3678 139.918 44.7837 136.791 55.6157 130.537L84.3848 113.927C95.2168 107.674 100.633 104.547 106.878 103.375C112.465 102.345 118.194 102.345 123.782 103.375C130.027 104.547 135.443 107.674 146.275 113.927L175.044 130.537C185.876 136.791 191.292 139.918 193.321 143.524C195.106 146.695 195.106 150.112 193.321 153.283C191.292 156.889 185.876 160.016 175.044 166.27L146.275 182.88C135.443 189.133 130.027 192.26 123.782 193.432C118.194 194.462 112.465 194.462 106.878 193.432C100.633 192.26 95.2168 189.133 84.3848 182.88L55.6157 166.27Z"
            id="basics3"
            style={{ fill: "var(--color-brand)" }}
          />
          <path
            d="M55.6157 133.469C44.7837 127.215 39.3678 124.088 37.3388 120.482C35.5538 117.311 35.5538 113.894 37.3388 110.722C39.3678 107.117 44.7837 103.99 55.6157 97.7359L84.3848 81.1259C95.2168 74.8719 100.633 71.7459 106.878 70.5739C112.465 69.5434 118.194 69.5434 123.782 70.5739C130.027 71.7459 135.443 74.8729 146.275 81.1259L175.044 97.7359C185.876 103.99 191.292 107.117 193.321 110.722C195.106 113.894 195.106 117.311 193.321 120.482C191.292 124.088 185.876 127.215 175.044 133.469L146.275 150.078C135.443 156.332 130.027 159.459 123.782 160.631C118.194 161.661 112.465 161.661 106.878 160.631C100.633 159.459 95.2168 156.332 84.3848 150.078L55.6157 133.469Z"
            id="basics2"
            style={{ fill: "var(--color-brand-light)" }}
          />
          <path
            d="M55.6157 100.667C44.7837 94.4139 39.3678 91.2869 37.3388 87.6809C35.5538 84.5089 35.5538 81.0929 37.3388 77.9209C39.3678 74.3159 44.7837 71.1889 55.6157 64.9349L84.3848 48.3249C95.2168 42.0709 100.633 38.9449 106.878 37.7729C112.465 36.7424 118.194 36.7424 123.782 37.7729C130.027 38.9439 135.443 42.0709 146.275 48.3249L175.044 64.9349C185.876 71.1889 191.292 74.3149 193.321 77.9209C195.106 81.0929 195.106 84.5089 193.321 87.6809C191.292 91.2869 185.876 94.4139 175.044 100.667L146.275 117.277C135.443 123.531 130.027 126.658 123.782 127.829C118.194 128.86 112.465 128.86 106.878 127.829C100.633 126.658 95.2168 123.531 84.3848 117.277L55.6157 100.667Z"
            id="basics1"
            style={{ fill: "var(--color-brand-lighter)" }}
          />
        </motion.g>

        {/* Components section - animated g group */}
        <motion.g
          animate={{
            opacity: activeSection === "components" ? 1 : 0,
            y: activeSection === "components" ? 0 : 20,
          }}
          id="components_2"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <path
            d="M58 83C93.3462 83 122 54.3462 122 19C122 -16.3462 93.3462 -45 58 -45C22.6538 -45 -6 -16.3462 -6 19C-6 54.3462 22.6538 83 58 83Z"
            id="components1"
            style={{ fill: "var(--color-brand)" }}
          />
          <path
            d="M58 211C93.3462 211 122 182.346 122 147C122 111.654 93.3462 83 58 83C22.6538 83 -6 111.654 -6 147C-6 182.346 22.6538 211 58 211Z"
            id="components2"
            style={{ fill: "var(--color-brand-light)" }}
          />
          <path
            d="M174 147C209.346 147 238 118.346 238 83C238 47.6538 209.346 19 174 19C138.654 19 110 47.6538 110 83C110 118.346 138.654 147 174 147Z"
            id="components3"
            style={{ fill: "var(--color-brand-lighter)" }}
          />
          <path
            d="M174 275C209.346 275 238 246.346 238 211C238 175.654 209.346 147 174 147C138.654 147 110 175.654 110 211C110 246.346 138.654 275 174 275Z"
            id="components4"
            style={{ fill: "var(--color-brand)" }}
          />
        </motion.g>
      </g>
    </motion.svg>
  );
}

// Blocks MenuIllustration - for hero, pricing, testimonial
export function BlocksMenuIllustration({
  activeSection,
  className = "",
}: MenuIllustrationProps) {
  return (
    <motion.svg
      animate={{ opacity: 1 }}
      aria-label={`Blocks menu illustration for ${activeSection} section`}
      className={cn(className, "overflow-hidden rounded-md")}
      fill="none"
      height="231"
      initial={{ opacity: 0 }}
      role="img"
      style={{ overflow: "hidden" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      viewBox="0 0 231 231"
      width="231"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_143_112)" id="blocks">
        {/* Common background - always visible */}
        <rect className="fill-brand-secondary" height="231" width="231" />

        {/* Hero section - animated g group */}
        <motion.g
          animate={{
            opacity: activeSection === "hero" ? 1 : 0,
            y: activeSection === "hero" ? 0 : 20,
          }}
          id="hero"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <path
            d="M255 255.5C184.308 255.5 127 198.192 127 127.5L383 127.5C383 198.192 325.692 255.5 255 255.5Z"
            id="hero1"
            style={{ fill: "var(--color-brand-lighter)" }}
          />
          <path
            d="M255 0.499994C184.308 0.499991 127 57.808 127 128.5L383 128.5C383 57.808 325.692 0.499997 255 0.499994Z"
            id="hero2"
            style={{ fill: "var(--color-brand)" }}
          />
          <rect
            height="37"
            id="hero3"
            rx="18.5"
            style={{ fill: "var(--color-brand-light)" }}
            width="185"
            x="-69"
            y="55.1384"
          />
          <rect
            height="37"
            id="hero4"
            rx="18.5"
            style={{ fill: "var(--color-brand)" }}
            width="154"
            x="-53"
            y="103.138"
          />
          <rect
            height="19"
            id="hero5"
            rx="9.5"
            style={{ fill: "var(--color-brand-lighter)" }}
            width="77"
            x="12"
            y="151"
          />
        </motion.g>

        {/* Pricing section - animated g group */}
        <motion.g
          animate={{
            opacity: activeSection === "pricing" ? 1 : 0,
            y: activeSection === "pricing" ? 0 : 20,
          }}
          id="pricing"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <rect
            height="45"
            id="pricing1"
            rx="22.5"
            style={{ fill: "var(--color-brand)" }}
            transform="rotate(-90 36 262)"
            width="188"
            x="36"
            y="262"
          />
          <rect
            height="45"
            id="pricing2"
            rx="22.5"
            style={{ fill: "var(--color-brand-light)" }}
            transform="rotate(-90 91 262)"
            width="226"
            x="91"
            y="262"
          />
          <rect
            height="45"
            id="pricing3"
            rx="22.5"
            style={{ fill: "var(--color-brand-lighter)" }}
            transform="rotate(-90 150 262)"
            width="188"
            x="150"
            y="262"
          />
        </motion.g>

        {/* Testimonial section - animated g group */}
        <motion.g
          animate={{
            opacity: activeSection === "testimonial" ? 1 : 0,
            y: activeSection === "testimonial" ? 0 : 20,
          }}
          id="testimonial"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <rect
            height="45"
            id="testimonial3"
            rx="22.5"
            style={{ fill: "var(--color-brand-light)" }}
            width="188"
            x="22"
            y="62"
          />
          <rect
            height="45"
            id="testimonial4"
            rx="22.5"
            style={{ fill: "var(--color-brand-lighter)" }}
            width="188"
            x="22"
            y="124"
          />
          <circle
            cx="46.5"
            cy="84.5"
            id="testimonial2"
            r="15.5"
            style={{ fill: "var(--color-brand)" }}
          />
          <circle
            cx="46.5"
            cy="146.5"
            id="testimonial1"
            r="15.5"
            style={{ fill: "var(--color-brand)" }}
          />
        </motion.g>
      </g>

      <defs>
        <clipPath id="clip0_143_112">
          <rect fill="white" height="231" width="231" />
        </clipPath>
      </defs>
    </motion.svg>
  );
}
