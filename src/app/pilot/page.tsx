import type { Metadata } from "next";
import { Section, Grid, Block, Button, Highlight, Picture, Rule, Text } from "@/components/blocks";
import { overviewTimeline, stats, tracks } from "@/content/pilot";

export const metadata: Metadata = {
  title: "Pilot Program",
  alternates: { canonical: "/pilot" },
};

export default function PilotPage() {
  return (
    <>
      <Section theme="bright" minHeight={10} pad={10} divider z={7} bg="/images/bgpattern.png">
        <Grid rows={[11, 12]}>
          <Block area={["1/2/7/10", "2/4/8/24"]} z={[4, 1]} v={["start", "center"]}>
            <Text>
              <h1 className="center"><span className="light">{"Paid internships that "}</span><Highlight stroke="0.1em"><span className="light">count</span></Highlight>{" "}<span className="light">toward your degree</span></h1>
              <p></p>
            </Text>
          </Block>
          <Block area={["5/2/8/10", "7/8/10/20"]} z={[0, 2]} v="center">
            <Text>
              <h4 className="center white">Telos is training 50 Philadelphia students for paid internships that earn six college credits.</h4>
            </Text>
          </Block>
          <Block area={["9/2/11/6", "10/10/12/14"]} z={[5, 3]} v="center">
            <Button href="/pilot-students">For Students</Button>
          </Block>
          <Block area={["9/6/11/10", "10/14/12/18"]} z={[6, 4]} v="center">
            <Button href="/pilot-employers" variant="secondary">For Employers</Button>
          </Block>
        </Grid>
      </Section>
      <Section theme="white-bold" minHeight={10} pad={10} divider z={6} bg="/images/bgpattern.png">
        <Grid rows={[11, 10]}>
          <Block area={["2/2/3/10", "2/5/7/23"]} v="center">
            <Text>
              <h2 className="center navy">Telos is building a new kind of college where students live on campus but earn up to half of their degree through paid work.</h2>
            </Text>
          </Block>
          <Block area={["4/2/11/10", "7/6/11/22"]} z={1} v="center">
            <Text>
              <p className="large center navy">Students will rotate through campus jobs, local internships, and entrepreneurship, graduating with over $50,000 in earnings, minimal debt, and a track record of real work to stand out in the job market. The Summer 2028 Pilot is our proof of concept, available to college students across Philadelphia.</p>
            </Text>
          </Block>
        </Grid>
      </Section>
      <Section theme="light-bold">
        <Grid rows={[13, 9]}>
          <Block area={["2/2/8/10", "3/15/9/27"]} z={[3, 4]}>
            <Text>
              <h4>For Students</h4>
              <h3>The problem is access.</h3>
              <p>Paid internships improve career outcomes, but most students can&apos;t land one, and understaffed career offices are not resourced to help.</p>
            </Text>
          </Block>
          <Block area={["8/2/13/10", "3/2/7/14"]} z={[1, 2]}>
            <Text>
              <h1>{stats.students.value}</h1>
              <h4>{stats.students.label}</h4>
            </Text>
          </Block>
        </Grid>
      </Section>
      <Section theme="bright">
        <Grid rows={[10, 9]}>
          <Block area={["2/2/6/10", "3/2/9/14"]} z={1}>
            <Text>
              <h4>For Employers</h4>
              <h3>The problem is management.</h3>
              <p className="white">Internship programs must deliver ROI to employers. Interns convert to full-time hires at high rates, but high setup and maintenance costs are barriers to realizing that value.</p>
            </Text>
          </Block>
          <Block area={["6/2/11/10", "3/15/9/27"]} z={3}>
            <Text>
              <h1 className="white">{stats.employers.value}</h1>
              <h4 className="white">{stats.employers.label}</h4>
              <p className="small"></p>
            </Text>
          </Block>
        </Grid>
      </Section>
      <Section theme="white-bold" height="medium">
        <Grid rows={[18, 10]}>
          <Block area={["1/2/3/10", "1/5/4/23"]} z={1}>
            <Text>
              <h2 className="center">A structured training and internship program that matches talented students to employers.</h2>
            </Text>
          </Block>
          <Block area={["3/1/4/11", "5/4/6/24"]} z={2} v="center">
            <Rule />
          </Block>
          <Block area={["4/2/5/10", "6/3/7/6"]} z={6}>
            <Text>
              <p className="center">{overviewTimeline[0].date}</p>
            </Text>
          </Block>
          <Block area={["5/2/7/10", "7/3/9/6"]} z={7}>
            <Text>
              <h3 className="center">{overviewTimeline[0].title}</h3>
            </Text>
          </Block>
          <Block area={["6/2/8/10", "9/2/11/7"]} z={8}>
            <Text>
              <p className="center">{overviewTimeline[0].body}</p>
            </Text>
          </Block>
          <Block area={["9/2/10/10", "6/12/7/16"]} z={7}>
            <Text>
              <p className="center">{overviewTimeline[1].date}</p>
            </Text>
          </Block>
          <Block area={["10/2/12/10", "7/12/9/16"]} z={8}>
            <Text>
              <h3 className="center">{overviewTimeline[1].title}</h3>
            </Text>
          </Block>
          <Block area={["11/2/12/10", "9/11/11/17"]} z={9}>
            <Text>
              <p className="center">{overviewTimeline[1].body}</p>
            </Text>
          </Block>
          <Block area={["13/2/14/10", "6/22/7/25"]} z={7}>
            <Text>
              <p className="center">{overviewTimeline[2].date}</p>
            </Text>
          </Block>
          <Block area={["14/2/16/10", "7/21/9/26"]} z={9}>
            <Text>
              <h3 className="center">{overviewTimeline[2].title}</h3>
            </Text>
          </Block>
          <Block area={["15/2/17/10", "9/21/11/26"]} z={10}>
            <Text>
              <p className="center">{overviewTimeline[2].body}</p>
            </Text>
          </Block>
        </Grid>
      </Section>
      <Section theme="light-bold" height="medium">
        <Grid rows={[42, 21]}>
          <Block area={["1/3/6/9", "1/7/4/21"]} z={4}>
            <Text>
              <h2 className="center navy">Three tracks in three industries where Philly is hiring</h2>
            </Text>
          </Block>
          <Block area={["6/2/12/10", "5/4/12/10"]} z={1} v="center">
            <Picture
              src={tracks[0].image}
              alt=""
              radius="12px"
              overlay="rgba(37, 53, 80, 0.5)"
              sizes="(min-width: 768px) 23vw, 89vw"
            />
          </Block>
          <Block area={["12/2/14/10", "13/4/15/10"]} z={6}>
            <Text>
              <h4 className="center">{tracks[0].name}</h4>
            </Text>
          </Block>
          <Block area={["14/2/20/10", "5/11/12/17"]} z={2} v="center">
            <Picture
              src={tracks[1].image}
              alt=""
              radius="12px"
              overlay="rgba(37, 53, 80, 0.5)"
              sizes="(min-width: 768px) 23vw, 89vw"
            />
          </Block>
          <Block area={["20/2/22/10", "13/10/15/18"]} z={7}>
            <Text>
              <h4 className="center">{tracks[1].name}</h4>
            </Text>
          </Block>
          <Block area={["22/2/28/10", "5/18/12/24"]} z={3} v="center">
            <Picture
              src={tracks[2].image}
              alt=""
              radius="12px"
              overlay="rgba(37, 53, 80, 0.5)"
              sizes="(min-width: 768px) 23vw, 89vw"
            />
          </Block>
          <Block area={["28/2/30/10", "13/18/15/25"]} z={7}>
            <Text>
              <h4 className="center">{tracks[2].name}</h4>
            </Text>
          </Block>
          <Block area={["30/2/39/10", "15/4/19/24"]} z={8}>
            <Text>
              <p className="large center navy">Colleges can improve outcomes by focusing on occupations and industries with strong demand. Telos will place students into large entry-level talent pools within industries that employ more than 1.6 million people in the Philadelphia region, including growing sectors like manufacturing and health care.</p>
            </Text>
          </Block>
          <Block area={["39/2/41/10", "20/8/22/14"]} z={9} v="center">
            <Button href="/pilot-students">For Students</Button>
          </Block>
          <Block area={["41/2/43/10", "20/14/22/20"]} z={10} v="center">
            <Button href="/pilot-employers" variant="secondary">For Employers</Button>
          </Block>
        </Grid>
      </Section>
    </>
  );
}
