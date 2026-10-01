import type { Metadata } from "next";
import Link from "next/link";
import { Section, Grid, Block, Text } from "@/components/blocks";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Section theme="bright" minHeight={10} pad={10}>
      <Grid rows={[6, 6]}>
        <Block area={["1/2/7/10", "1/6/7/22"]} v="center">
          <Text>
            <h1 className="center light">Page not found</h1>
            <p className="large center light">
              We couldn’t find the page you were looking for. Check the address, or return to the{" "}
              <Link href="/">homepage</Link>.
            </p>
          </Text>
        </Block>
      </Grid>
    </Section>
  );
}
