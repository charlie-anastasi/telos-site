import type { Metadata } from "next";
import { Section, Grid, Block, Text } from "@/components/blocks";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Get in Touch - Collaborate with Us",
  description: "Connect with Telos for updates and collaboration opportunities. Join our community to stay informed about development and upcoming initiatives at Telos in Philadelphia.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Section theme="bright" minHeight={1} pad={1}>
        <Grid rows={[5, 6]}>
          <Block area={["1/2/3/10", "1/6/4/22"]} z={6} v={["start", "center"]}>
            <Text>
              <h1 className="center light">Contact us</h1>
            </Text>
          </Block>
          <Block area={["3/2/5/10", "4/8/7/20"]} z={7}>
            <Text>
              <p className="large center light">If you want to follow the journey, or help build it, we would love to hear from you.</p>
            </Text>
          </Block>
        </Grid>
      </Section>
      <Section theme="bright" minHeight={1} pad={1}>
        <Grid rows={[15, 16]}>
          <Block area={["1/2/15/10", "1/6/15/22"]} z={3}>
            <ContactForm form="contact" />
          </Block>
        </Grid>
      </Section>
      <Section theme="white">
        <Grid rows={[1, 1]}>

        </Grid>
      </Section>
    </>
  );
}
