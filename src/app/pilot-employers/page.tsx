import type { Metadata } from "next";
import { Section, Grid, Block, Button, Highlight, Picture, Rule, Shape, Text } from "@/components/blocks";
import { employerTimeline } from "@/content/pilot";

export const metadata: Metadata = {
  title: "For Employers",
  alternates: { canonical: "/pilot-employers" },
};

export default function PilotEmployersPage() {
  return (
    <>
      <Section theme="bright" minHeight={10} pad={10} divider z={7} bg="/images/bgpattern.png">
        <Grid rows={[10, 8]}>
          <Block area={["2/1/4/11", "2/2/4/26"]} z={4} v={["start", "center"]}>
            <Text>
              <h1 className="center"><span className="light">{"Long-term investment. Immediate "}</span><Highlight><span className="light">impact.</span></Highlight></h1>
            </Text>
          </Block>
          <Block area={["4/2/8/10", "4/6/5/22"]} v="center">
            <Text>
              <h4 className="center white">Telos sources, trains, and supports your interns, so your team can develop a talent pipeline while continuing to build your business.</h4>
            </Text>
          </Block>
          <Block area={["8/4/10/8", "6/12/8/16"]} z={5} v="center">
            <Button href="/contact">Talk to Telos</Button>
          </Block>
        </Grid>
      </Section>
      <Section theme="white-bold" height="medium">
        <Grid rows={[48, 42]}>
          <Block area={["1/2/3/10", "1/8/4/20"]} z={3}>
            <Text>
              <h3 className="center">Telos solves three things that make internships expensive</h3>
            </Text>
          </Block>
          <Block area={["3/2/4/10", "4/3/5/25"]} z={4} v="center">
            <Rule />
          </Block>
          <Block area={["4/2/5/10", "6/16/7/24"]} z={2}>
            <Text>
              <p>SOURCING</p>
            </Text>
          </Block>
          <Block area={["5/2/7/10", "7/16/10/24"]} z={3}>
            <Text>
              <h3>A better hiring pipeline at lower cost</h3>
            </Text>
          </Block>
          <Block area={["11/2/18/10", "5/3/15/14"]} v="center">
            <Picture
              src="/images/imgg-33k-umvq1bq1.png"
              alt=""
              radius="12px"
              overlay="rgba(37, 53, 80, 0.5)"
              align="left"
              sizes="(min-width: 768px) 43vw, 89vw"
            />
          </Block>
          <Block area={["7/2/12/10", "10/16/14/24"]} z={1}>
            <Text>
              <p>Recruiting interns requires operating an expensive, time-consuming hiring funnel. Telos sources and screens from local colleges. You interview pre-screened finalists and make final decisions.</p>
              <p></p>
            </Text>
          </Block>
          <Block area={["18/2/19/10", "15/3/16/25"]} z={5} v="center">
            <Rule />
          </Block>
          <Block area={["19/2/20/10", "19/4/20/12"]} z={3}>
            <Text>
              <p>MANAGEMENT</p>
            </Text>
          </Block>
          <Block area={["21/2/28/10", "22/4/28/12"]} z={2}>
            <Text>
              <p>Younger talent in your organization wants the opportunity to manage. The Telos intern program gives that opportunity while also providing an added layer of training, onboarding, and evaluation . With Telos support, your managers will be great mentors who continue to hit their goals.</p>
              <p><br /></p>
            </Text>
          </Block>
          <Block area={["20/2/22/10", "20/4/22/12"]} z={4}>
            <Text>
              <h3>Empower your managers</h3>
            </Text>
          </Block>
          <Block area={["26/2/33/10", "17/14/27/25"]} z={1} v="center">
            <Picture
              src="/images/imgg-ta0-r26oe7h1.png"
              alt=""
              radius="12px"
              overlay="rgba(37, 53, 80, 0.5)"
              align="left"
              sizes="(min-width: 768px) 43vw, 89vw"
            />
          </Block>
          <Block area={["33/2/34/10", "29/3/30/25"]} z={6} v="center">
            <Rule />
          </Block>
          <Block area={["34/2/35/10", "33/16/34/24"]} z={4}>
            <Text>
              <p>TRAINING</p>
            </Text>
          </Block>
          <Block area={["36/2/42/10", "36/16/40/24"]} z={3}>
            <Text>
              <p>Summer internships end just as they start becoming productive. Telos students arrive trained against a pre-internship course we build using your company&apos;s knowledge base. During the summer, students complete continuing education each week, including labs where they build AI workflows your company can deploy.</p>
            </Text>
          </Block>
          <Block area={["35/2/37/10", "34/16/36/24"]} z={5}>
            <Text>
              <h3>Speed to impact</h3>
            </Text>
          </Block>
          <Block area={["42/2/49/10", "31/3/42/14"]} z={2} v="center">
            <Picture
              src="/images/imgg-5j9-j1zixm3l.png"
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
        <Grid rows={[28, 14]}>
          <Block area={["4/2/16/10", "5/3/13/13"]} z={2} v="center">
            <Shape />
          </Block>
          <Block area={["2/2/5/10", "3/2/6/26"]} z={1}>
            <Text>
              <h2 className="center">Who who work with</h2>
              <p></p>
            </Text>
          </Block>
          <Block area={["5/3/17/9", "6/4/11/12"]} z={3}>
            <Text>
              <h4>Existing Internship Program</h4>
              <ul data-rte-list="default"><li><p>Differentiate your program with academic credit to attract the best talent</p></li><li><p>Reduce burden on your People team and managers with training and coaching support</p></li><li><p>Improve efficacy of interns</p></li><li><p>Target size: Telos can run your whole internship program, or a segment</p></li></ul>
            </Text>
          </Block>
          <Block area={["16/2/28/10", "5/15/13/25"]} z={[3, 4]} v="center">
            <Shape />
          </Block>
          <Block area={["17/3/29/9", "6/16/12/24"]} z={[4, 5]}>
            <Text>
              <h4>Limited Internship Infrastructure</h4>
              <ul data-rte-list="default"><li><p>Consult with Telos to identify and scope priority backlog tasks that interns can complete</p></li><li><p>Build an early-talent pipeline that will make an impact this summer</p></li><li><p>Create management opportunities for junior talent in your organization</p></li><li><p>Target size: two to four interns</p><p></p><p></p></li></ul>
            </Text>
          </Block>
        </Grid>
      </Section>
      <Section theme="white-bold">
        <Grid rows={[28, 15]}>
          <Block area={["1/2/4/10", "2/2/6/26"]} z={1}>
            <Text>
              <p className="small center"></p>
              <h2 className="center">Summer 2028 Internships</h2>
            </Text>
          </Block>
          <Block area={["6/2/15/10", "6/3/14/9"]} z={4}>
            <Text>
              <p className="small">{employerTimeline[0].date}</p>
              <h4>{employerTimeline[0].title}</h4>
              <p>{employerTimeline[0].body}</p>
              <p></p>
            </Text>
          </Block>
          <Block area={["14/2/15/10", "8/16/9/20"]} z={4} v="center" rotate={[0, 90]}>
            <Rule />
          </Block>
          <Block area={["15/2/22/10", "6/11/14/17"]} z={5}>
            <Text>
              <p className="small">{employerTimeline[1].date}</p>
              <h4>{employerTimeline[1].title}</h4>
              <p>{employerTimeline[1].body}</p>
              <p></p>
            </Text>
          </Block>
          <Block area={["21/2/22/10", "8/8/9/12"]} z={3} v="center" rotate={[0, 90]}>
            <Rule />
          </Block>
          <Block area={["22/2/28/10", "6/19/14/25"]} z={6}>
            <Text>
              <p className="small">{employerTimeline[2].date}</p>
              <h4>{employerTimeline[2].title}</h4>
              <p>{employerTimeline[2].body}</p>
            </Text>
          </Block>
        </Grid>
      </Section>
      <Section theme="light-bold">
        <Grid rows={[48, 24]}>
          <Block area={["12/2/24/10", "9/2/23/9"]} z={2} v="center">
            <Shape />
          </Block>
          <Block area={["2/2/13/10", "3/2/9/26"]} z={1}>
            <Text>
              <h2 className="center">Should we just replace interns with AI?</h2>
              <p className="large center">The role of entry-level talent is shifting, but companies with great junior talent will outperform over the long term. Managed correctly, interns are a high-leverage investment in the future. The companies leaning into early talent agree.</p>
              <p><br /></p>
            </Text>
          </Block>
          <Block area={["13/3/23/9", "10/3/22/8"]} z={3}>
            <Text>
              <h4>IBM</h4>
              <p className="large">Tripling U.S. entry-level hiring in 2026 while rewriting junior roles around judgment, customer contact, and collaboration</p>
              <p><em>&quot;The companies three to five years from now that are going to be the most successful are those that doubled down on entry-level hiring.&quot; Nickle LaMoreaux, CHRO</em></p>
            </Text>
          </Block>
          <Block area={["24/2/35/10", "9/19/23/26"]} z={3} v="center">
            <Shape />
          </Block>
          <Block area={["25/3/34/9", "10/20/22/25"]} z={4}>
            <Text>
              <h4>Ramp</h4>
              <p className="large">Emerging talent program gives motivated students real responsibility and builds a future hiring pipeline</p>
              <p><em>{"[We look for] incredible aptitude, drive, and potential for performance "}</em><strong><em>early on</em></strong><em>, and start to build an affinity... we find those folks and give them a lot more responsibility.” Eric Glyman, CEO</em></p>
            </Text>
          </Block>
          <Block area={["35/2/48/10", "9/10/23/18"]} z={3} v="center">
            <Shape />
          </Block>
          <Block area={["36/3/47/9", "10/11/22/17"]} z={4}>
            <Text>
              <h4>Ernst &amp; Young</h4>
              <p className="large">EY Career Residency is a launchpad for early career talent that combines real-world experience with coaching and future-focused skills development</p>
              <p><em>“Our goal is to make EY US the most preferred place to launch an audit or tax career and become a springboard for future business leaders.” Ginnie Carlier, EY Americas Vice Chair – Talent</em></p>
            </Text>
          </Block>
        </Grid>
      </Section>
      <Section theme="bright" height="medium">
        <Grid rows={[10, 11]}>
          <Block area={["1/2/11/10", "1/5/9/23"]} z={1}>
            <Text>
              <h2 className="center white">You don’t have the choose between AI and entry-level talent</h2>
              <p className="large center white">Differentiate your brand and talent base by investing in the high-quality students who can make an impact today and steward your AI transformation in the future.</p>
              <p><br /></p>
            </Text>
          </Block>
          <Block area={["9/2/11/10", "9/11/11/17"]} z={2} v="center">
            <Button href="/contact">Talk to Telos</Button>
          </Block>
        </Grid>
      </Section>
    </>
  );
}
