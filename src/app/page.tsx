import { Section, Grid, Block, Button, Highlight, Picture, Rule, Text } from "@/components/blocks";

export default function HomePage() {
  return (
    <>
      <Section theme="bright" minHeight={10} pad={10} divider z={7} bg="/images/bgpattern.png">
        <Grid rows={[10, 11]}>
          <Block area={["2/1/4/11", "2/2/5/26"]} z={4} v={["start", "center"]}>
            <Text>
              <h1 className="center"><span className="light">{"A degree that "}</span><Highlight><span className="light">works</span></Highlight></h1>
            </Text>
          </Block>
          <Block area={["4/2/8/10", "5/6/8/22"]} v="center">
            <Text>
              <h4 className="center white">At Telos, every student works. They run campus operations, complete paid internships, and launch ventures that build on their courses. The work is real, pays, and counts toward the degree.</h4>
            </Text>
          </Block>
          <Block area={["8/4/10/8", "9/12/11/16"]} z={5} v="center">
            <Button href="#modernwork">Learn More</Button>
          </Block>
        </Grid>
      </Section>
      <Section theme="white-bold" divider="flip" z={6}>
        <Grid rows={[11, 11]}>
          <Block area={["3/2/10/10", "4/3/10/23"]} z={2}>
            <Text>
              <h2>High costs, job uncertainty, and AI have families questioning the value of going to college. Telos merges work &amp; learning so students don’t have to second guess four transformative years on campus.</h2>
            </Text>
          </Block>
        </Grid>
      </Section>
      <Section theme="light-bold" id="modernwork" minHeight={23} pad={23} divider z={5}>
        <Grid rows={[35, 24]}>
          <Block area={["2/2/4/10", "1/9/3/19"]} z={7}>
            <Text>
              <h2 className="navy">A modern work college</h2>
            </Text>
          </Block>
          <Block area={["4/2/5/10", "3/9/4/19"]} z={4} v="center">
            <Rule />
          </Block>
          <Block area={["5/2/11/10", "4/9/10/19"]} z={13}>
            <Text>
              <h4 className="navy">Work Program</h4>
              <p className="black">Telos students will take traditional courses while earning income and academic credit for part-time jobs and at least one full-time co-op. Graduates will finish with less debt, a liberal arts foundation, experience operating with AI, and a track record of real work that employers value.</p>
            </Text>
          </Block>
          <Block area={["11/2/12/10", "10/9/11/19"]} z={5} v="center">
            <Rule />
          </Block>
          <Block area={["12/2/18/10", "11/9/16/19"]} z={14}>
            <Text>
              <h4 className="navy">Modern Operations</h4>
              <p className="black">{"Telos will share online courses and administrative services with other universities to maintain high-quality without high tuition. Telos believes in quality over quantity, so it will pay higher salaries to a leaner group of top faculty and staff empowered by AI. "}</p>
            </Text>
          </Block>
          <Block area={["18/2/19/10", "16/9/17/19"]} z={6} v="center">
            <Rule />
          </Block>
          <Block area={["19/2/26/10", "17/9/23/19"]} z={15}>
            <Text>
              <h4 className="navy">Urban Campus</h4>
              <p className="black">Telos will preserve the dorms, co-curriculars, and social life that make college transformative. The lifelong friends and mentors you meet will be more impactful than the courses and jobs you fulfill. Telos rigorously prepares you for the future while remembering to embrace the joy of a campus experience.</p>
            </Text>
          </Block>
          <Block area={["26/2/27/10", "23/9/24/19"]} z={7} v="center">
            <Rule />
          </Block>
          <Block area={["28/6/35/10", "1/21/10/26"]} z={16} v="center">
            <Picture
              src="/images/classroomgirl.png"
              alt="A representation of a potential young female student at Telos (college founded by Charlie Anastasi) carrying a backpack and standing in a classroom in Philadelphia"
              focus="47.9463% 10.4007%"
              radius="12px"
              overlay="rgba(37, 53, 80, 0.46)"
              sizes="(min-width: 768px) 19vw, 43vw"
            />
          </Block>
          <Block area={["28/2/35/6", "14/2/23/7"]} z={17} v="center">
            <Picture
              src="/images/collegebasketball.png"
              alt="A representation of the athletic events and campus community at Telos (college founded by Charlie Anastasi) in Philadelphia, two basketball platers in action during a game. One college player is dribbling towards the basket."
              radius="12px"
              overlay="rgba(37, 53, 80, 0.42)"
              sizes="(min-width: 768px) 19vw, 43vw"
            />
          </Block>
        </Grid>
      </Section>
      <Section theme="white-bold" minHeight={10} pad={10} divider z={4} bg="/images/bgpattern.png">
        <Grid rows={[15, 12]}>
          <Block area={["2/2/7/10", "2/5/7/23"]} v="center">
            <Text>
              <h2 className="center navy">Telos is building a new kind of college where students live on campus but earn up to half of their degree through paid work.</h2>
            </Text>
          </Block>
          <Block area={["8/2/12/10", "7/6/10/22"]} z={1} v="center">
            <Text>
              <p className="large center navy">{"As a proof of concept, Telos is training 50 Philadelphia students for paid internships that earn six college credits. "}</p>
            </Text>
          </Block>
          <Block area={["13/2/15/10", "11/11/13/17"]} z={2} v="center">
            <Button href="/pilot">Summer 2028 Pilot</Button>
          </Block>
        </Grid>
      </Section>
      <Section theme="bright" id="learnmore" divider="flip" z={3}>
        <Grid rows={[6, 11]}>
          <Block area={["3/2/5/10", "4/3/9/21"]} z={2} v="center">
            <Text>
              <h2 className="light">We believe everyone has a unique contribution to share with the world. Telos exists to help you find and express yours.</h2>
            </Text>
          </Block>
        </Grid>
      </Section>
      <Section theme="light-bold">
        <Grid rows={[21, 19]}>
          <Block area={["2/2/3/8", "2/2/3/13"]} z={2}>
            <Text>
              <p className="black">FOLLOW ALONG</p>
            </Text>
          </Block>
          <Block area={["3/2/6/10", "3/2/11/13"]} z={4} v="center">
            <Text>
              <h4>Telos will be based in Philadelphia and is in active development.<br /><br />We are assembling a founding team, designing the curriculum, building the work program, and scouting locations.<br /><br />If you want to follow the journey, or help build it, we would love to hear from you.</h4>
            </Text>
          </Block>
          <Block area={["7/4/9/10", "15/7/17/12"]} z={6} v="center">
            <Button href="/contact">Contact Us</Button>
          </Block>
          <Block area={["6/2/8/4", "11/3/16/7"]} z={5} v="center">
            <Picture
              src="/images/arc.png"
              alt="Four hearts with arrow crossing through them, set against a black background."
              fit="contain"
              sizes="(min-width: 768px) 16vw, 20vw"
            />
          </Block>
          <Block area={["10/2/21/10", "2/14/18/26"]} z={6} v="center">
            <Picture
              src="/images/unsplash-image-exyehujrx-e.jpg"
              alt="A view of City Hall in Philadelphia, the city where founder Charlie Anastasi is planning the campus location for Telos."
              radius="16px"
              overlay="rgba(37, 53, 80, 0.57)"
              sizes="(min-width: 768px) 47vw, 89vw"
            />
          </Block>
        </Grid>
      </Section>
    </>
  );
}
