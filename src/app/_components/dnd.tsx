import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const Dnd: React.FC<{ readonly children: React.ReactNode }> = ({
  children
}) => {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
};
