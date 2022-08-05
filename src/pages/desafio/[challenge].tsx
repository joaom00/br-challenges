import { format } from 'date-fns'
import Image from 'next/image'
import ptBR from 'date-fns/locale/pt-BR'
import { HiOutlineClock } from 'react-icons/hi'

import { GetServerSideProps, NextPage } from 'next'

import { prismic } from 'service/prismic'
import { Challenge } from 'types/challenge'
import { formattedChallange } from 'utils/format'

import styles from './styles.module.scss'

const ChallengePage: NextPage<Challenge> = challenge => (
  <div className={styles.challenge}>
    <div className={styles.challenge__image}>
      <Image
        src={challenge.image.url}
        alt={challenge.image.alt}
        layout="fill"
        objectFit="cover"
      />
    </div>
    <h1>{challenge.title}</h1>
    <time>
      <HiOutlineClock />
      {format(new Date(challenge.deadline), "dd' de 'MMMM' de 'yyyy", {
        locale: ptBR
      })}
    </time>

    <div
      dangerouslySetInnerHTML={{ __html: challenge.content || '' }}
      className={styles.challenge__content}
    />
  </div>
)

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query
}) => {
  const challengeUID = String(query.challenge)

  const client = prismic({ req })

  const challenge = await client.getByUID('challenges', challengeUID)

  return { props: formattedChallange(challenge) }
}

export default ChallengePage
