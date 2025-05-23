import { observer } from "mobx-react-lite";
import { SectionComponentProps } from "@/components/sections/SectionComponentProps";
import CarouselSection from "@/components/sections/CarouselSection";

const ContainerSection = observer(({ section, context }: SectionComponentProps) => {
  return (<>
    {section.sections_resolved?.map((subsection) => {
      return <CarouselSection key={subsection.id} section={subsection} context={context} />;
    })}
  </>);
});

export default ContainerSection;