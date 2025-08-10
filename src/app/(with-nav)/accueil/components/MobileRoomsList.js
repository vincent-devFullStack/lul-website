import { memo } from "react";

const MobileRoomsList = memo(({ salles, handleRoomClick }) => (
  <div className="lg:hidden min-h-screen border-1 border-[var(--brown)] rounded-lg bg-gradient-to-b from-[var(--header-background)] to-[var(--login-background)] w-full overflow-x-hidden">
    {/* Contenu existant */}
  </div>
));

MobileRoomsList.displayName = "MobileRoomsList";
export default MobileRoomsList;
