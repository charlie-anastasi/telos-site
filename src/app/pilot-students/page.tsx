import type { Metadata } from "next";
import { Section, Grid, Block, Button, Highlight, Picture, Rule, Text } from "@/components/blocks";
import { studentTimeline } from "@/content/pilot";

export const metadata: Metadata = {
  title: "For Students",
  alternates: { canonical: "/pilot-students" },
};

export default function PilotStudentsPage() {
  return (
    <>
      <Section theme="bright" minHeight={10} pad={10} divider z={6} bg="/images/bgpattern.png">
        <Grid rows={[13, 9]}>
          <Block area={["2/2/6/10", "2/2/4/26"]} z={4} v={["start", "center"]}>
            <Text>
              <h1 className="center"><span className="light">{"Deliver value. Earn credit. "}</span><Highlight><span className="light">Launch</span></Highlight>{" "}<span className="light">your career.</span></h1>
            </Text>
          </Block>
          <Block area={["6/2/10/10", "4/6/6/22"]} v="center">
            <Text>
              <h4 className="center white">{"A rigorous summer internship program in Philadelphia, with training before and during the job. You’ll make a real impact, get paid, and and earn credits toward your degree. "}</h4>
            </Text>
          </Block>
          <Block area={["11/2/13/10", "7/12/9/16"]} z={5} v="center">
            <Button href="/contact-1">Register for early access</Button>
          </Block>
        </Grid>
      </Section>
      <Section theme="white-bold" height="medium">
        <Grid rows={[70, 55]}>
          <Block area={["1/2/3/10", "1/8/4/20"]} z={3}>
            <Text>
              <h3 className="center">Four things a typical summer internship doesn’t give you</h3>
            </Text>
          </Block>
          <Block area={["3/2/4/10", "4/3/5/25"]} z={4} v="center">
            <Rule />
          </Block>
          <Block area={["4/2/5/10", "7/16/8/24"]} z={2}>
            <Text>
              <p>TRAINING AND SUPPORT</p>
            </Text>
          </Block>
          <Block area={["5/2/7/10", "8/16/10/24"]} z={3}>
            <Text>
              <h3>Develop your abilities</h3>
            </Text>
          </Block>
          <Block area={["12/2/19/10", "6/3/16/14"]} v="center">
            <Picture
              src="/images/imgg-icb-1ajsd8rt.png"
              alt=""
              radius="12px"
              overlay="rgba(37, 53, 80, 0.5)"
              align="left"
              sizes="(min-width: 768px) 43vw, 89vw"
            />
          </Block>
          <Block area={["7/2/13/10", "10/16/15/24"]} z={1}>
            <Text>
              <p>The most important part of your internship is delivering value to your employer, but many interns aren&apos;t set up to make a difference. The Telos program requires pre-internship training, weekly workshops, and a dedicated career guide to challenge and support you throughout the summer.</p>
              <p></p>
            </Text>
          </Block>
          <Block area={["20/2/21/10", "17/3/18/25"]} z={5} v="center">
            <Rule />
          </Block>
          <Block area={["21/2/22/10", "21/4/22/12"]} z={3}>
            <Text>
              <p>ACADEMIC CREDIT</p>
            </Text>
          </Block>
          <Block area={["22/2/24/10", "22/4/24/12"]} z={4}>
            <Text>
              <h3>Six credits toward your degree</h3>
            </Text>
          </Block>
          <Block area={["28/2/35/10", "19/14/30/25"]} z={1} v="center">
            <Picture
              src="/images/imgg-31c-8ccwvu9d.png"
              alt=""
              radius="12px"
              overlay="rgba(37, 53, 80, 0.5)"
              align="left"
              sizes="(min-width: 768px) 43vw, 89vw"
            />
          </Block>
          <Block area={["24/2/29/10", "24/4/26/12"]} z={2}>
            <Text>
              <p>Your work and learning is assessed by an accredited institution, equating to six credit hours toward your degree. Schools often charge $3,000 - $6,000 for six credits.</p>
            </Text>
          </Block>
          <Block area={["36/2/37/10", "30/3/31/25"]} z={6} v="center">
            <Rule />
          </Block>
          <Block area={["37/2/38/10", "33/16/34/24"]} z={4}>
            <Text>
              <p>PAY</p>
            </Text>
          </Block>
          <Block area={["38/2/40/10", "34/16/36/24"]} z={5}>
            <Text>
              <h3>Earn and learn</h3>
            </Text>
          </Block>
          <Block area={["40/2/45/10", "36/16/38/24"]} z={3}>
            <Text>
              <p>Every Telos internship has a target pay rate of $20+ per hour so you can cover your costs and save for next semester.</p>
            </Text>
          </Block>
          <Block area={["43/2/45/10", "38/16/40/24"]} z={4}>
            <Text>
              <h3>$7,500 - $10,000</h3>
            </Text>
          </Block>
          <Block area={["46/2/53/10", "45/14/56/25"]} z={3} v="center">
            <Picture
              src="/images/imgg-kax-e3z8pvzg.png"
              alt=""
              radius="12px"
              overlay="rgba(37, 53, 80, 0.5)"
              align="left"
              sizes="(min-width: 768px) 43vw, 89vw"
            />
          </Block>
          <Block area={["44/2/49/10", "40/16/41/24"]} z={4}>
            <Text>
              <p>Target internship earnings</p>
            </Text>
          </Block>
          <Block area={["54/2/55/10", "43/3/44/25"]} z={7} v="center">
            <Rule />
          </Block>
          <Block area={["55/2/56/10", "47/4/48/12"]} z={5}>
            <Text>
              <p>IMPACT</p>
            </Text>
          </Block>
          <Block area={["56/2/58/10", "48/4/50/12"]} z={6}>
            <Text>
              <h3>Make a difference</h3>
            </Text>
          </Block>
          <Block area={["58/2/63/10", "50/4/53/12"]} z={4}>
            <Text>
              <p>Telos works with its employer network to design internships that allow students to take on real responsibility. Telos believes pay and credit are prerequisites to a good internship, but we want students who are driven by their desire to contribute to a worthy mission.</p>
            </Text>
          </Block>
          <Block area={["63/2/70/10", "32/3/42/14"]} z={2} v="center">
            <Picture
              src="/images/imgg-lpa-cmmtsy8q.png"
              alt=""
              radius="12px"
              overlay="rgba(37, 53, 80, 0.5)"
              align="left"
              sizes="(min-width: 768px) 43vw, 89vw"
            />
          </Block>
        </Grid>
      </Section>
      <Section theme="light-bold">
        <Grid rows={[34, 10]}>
          <Block area={["2/2/6/10", "2/2/3/26"]} z={1}>
            <Text>
              <h2 className="center">Early access begins Spring 2027</h2>
            </Text>
          </Block>
          <Block area={["7/2/13/10", "4/3/9/7"]} z={3}>
            <Text>
              <p className="small">{studentTimeline[0].date}</p>
              <h4>{studentTimeline[0].title}</h4>
              <p>{studentTimeline[0].body}</p>
            </Text>
          </Block>
          <Block area={["13/2/14/10", "6/6/7/10"]} z={2} v="center" rotate={[0, 90]}>
            <Rule />
          </Block>
          <Block area={["14/2/21/10", "4/9/10/13"]} z={4}>
            <Text>
              <p className="small">{studentTimeline[1].date}</p>
              <h4>{studentTimeline[1].title}</h4>
              <p>{studentTimeline[1].body}</p>
              <p></p>
            </Text>
          </Block>
          <Block area={["20/2/21/10", "6/12/7/16"]} z={3} v="center" rotate={[0, 90]}>
            <Rule />
          </Block>
          <Block area={["21/2/28/10", "4/15/10/19"]} z={5}>
            <Text>
              <p className="small">{studentTimeline[2].date}</p>
              <h4>{studentTimeline[2].title}</h4>
              <p>{studentTimeline[2].body}</p>
              <p></p>
            </Text>
          </Block>
          <Block area={["27/2/28/10", "6/18/7/22"]} z={4} v="center" rotate={[0, 90]}>
            <Rule />
          </Block>
          <Block area={["28/2/34/10", "4/21/9/25"]} z={6}>
            <Text>
              <p className="small">{studentTimeline[3].date}</p>
              <h4>{studentTimeline[3].title}</h4>
              <p>{studentTimeline[3].body}</p>
            </Text>
          </Block>
        </Grid>
      </Section>
      <Section theme="white-bold">
        <Grid rows={[21, 13]}>
          <Block area={["2/2/14/10", "3/4/12/15"]} z={1}>
            <Text>
              <p className="small">ELIGIBILITY REQUIREMENTS</p>
              <h2>High standards, high support</h2>
              <p className="large">We believe students are incredibly talented, so we expect Telos students to deliver incredible effort and impact. Telos commits to matching your effort with the support, training, and mentors that will bring out your best. Telos will scale its student base over the next few years, but its first cohort will be challenging to earn a spot in.</p>
            </Text>
          </Block>
          <Block area={["14/2/22/10", "5/17/10/25"]} z={2}>
            <Text>
              <h4>The application process</h4>
              <ul data-rte-list="default"><li><p>Rising junior or senior Summer 2028</p></li><li><p>Letter or recommendation, resume, and a work artifact</p></li><li><p>Screening interview with Telos</p></li><li><p>Live work session</p></li></ul>
            </Text>
          </Block>
        </Grid>
      </Section>
      <Section theme="bright" minHeight={38} pad={38}>
        <Grid rows={[5, 6]}>
          <Block area={["1/2/4/10", "2/5/5/23"]} z={1}>
            <Text>
              <h2 className="center white">Fifteen early-access spots will open March 2027.</h2>
            </Text>
          </Block>
          <Block area={["4/2/6/10", "5/11/7/17"]} z={2} v="center">
            <Button href="/contact-1">Register for early access</Button>
          </Block>
        </Grid>
      </Section>
    </>
  );
}
