import { Section, Grid, Block, Rule, Text } from "@/components/blocks";
import { Newsletter } from "@/components/Newsletter";
import { SocialLinks } from "@/components/SocialLinks";
import { footer, site } from "@/content/site";

export function FooterSections() {
  return (
    <>
      <Section theme="white-bold" minHeight={10} pad={10}>
        <Grid rows={[21, 11]}>
          <Block area={["1/2/2/10", "1/2/2/26"]} z={2} v="center">
            <Rule />
          </Block>
          <Block area={["3/2/18/10", "2/2/12/11"]} z={1}>
            <Newsletter />
          </Block>
          <Block area={["18/2/19/10", "2/18/3/26"]} z={3}>
            <Text>
              <pre className="right"><code>{footer.founder}</code></pre>
            </Text>
          </Block>
          <Block area={["19/2/21/10", "3/18/5/26"]} z={4}>
            <Text>
              <pre className="right"><code>{site.email + "\n"}</code></pre>
            </Text>
          </Block>
          <Block area={["20/2/22/10", "4/22/6/26"]} z={4}>
            <SocialLinks />
          </Block>
        </Grid>
      </Section>
    </>
  );
}
