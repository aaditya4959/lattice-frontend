import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { EditorMockup } from './editor-mockup';

export function ProductPreview() {
  return (
    <ContainerScroll
      titleComponent={
        <>
          <h2 className="text-3xl font-bold md:text-5xl">
            One document.
            <br />
            <span className="text-primary">Everyone in it.</span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-lg text-base md:text-lg">
            Every edit, cursor, and highlight syncs the instant it happens — no refresh, no
            merge conflicts.
          </p>
        </>
      }
    >
      <EditorMockup />
    </ContainerScroll>
  );
}
