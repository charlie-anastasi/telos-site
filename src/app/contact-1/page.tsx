import type { Metadata } from "next";
import { Section, Grid, Block, Text } from "@/components/blocks";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Get in Touch - Collaborate with Us",
  description: "Connect with Telos for updates and collaboration opportunities. Join our community to stay informed about development and upcoming initiatives at Telos in Philadelphia.",
  alternates: { canonical: "/contact-1" },
};

export default function Contact1Page() {
  return (
    <>
      <Section theme="bright" minHeight={1} pad={1}>
        <Grid rows={[5, 5]}>
          <Block area={["1/2/3/10", "1/6/4/22"]} z={6} v={["start", "center"]}>
            <Text>
              <h1 className="center light">Pilot early access</h1>
            </Text>
          </Block>
          <Block area={["3/2/5/10", "4/8/6/20"]} z={7}>
            <Text>
              <p className="large center light">If you want early access to the internship pilot, sign up to be the first to hear.</p>
            </Text>
          </Block>
        </Grid>
      </Section>
      <Section theme="bright" minHeight={1} pad={1}>
        <Grid rows={[15, 16]}>
          <Block area={["1/2/15/10", "1/6/15/22"]} z={3}>
            <ContactForm form="contact-1" />
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
