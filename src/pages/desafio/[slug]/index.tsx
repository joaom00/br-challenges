import Link from 'next/link'
import { useEffect, useState } from 'react'
import { HiPencilAlt } from 'react-icons/hi'
import { useSession } from 'next-auth/react'
import { PrismicRichText } from '@prismicio/react'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'

import { SEO } from 'components/SEO'
import { AuthorCard } from 'components/AuthorCard'
import { ChallengeHeader } from 'components/Challenge'

import { Challenge } from 'types'
import { CACHE_PAGE } from 'utils/constants'
import { formattedChallenge } from 'utils/format'
import { ChallengeProvider } from 'hook/useChallenge'
import { createClientPrismic, collectionSlugs } from 'service/prismic'

import styles from './styles.module.scss'

const ChallengePage: NextPage<Challenge> = challenge => {
  const { status, data } = useSession()
  const [isParticipate, setIsParticipate] = useState<boolean>(false)

  useEffect(() => {
    setIsParticipate(!!data?.user.challenges.includes(challenge.id))
  }, [data?.user])

  return (
    <ChallengeProvider challenge={challenge}>
      <SEO
        tabName={`Desafio - ${challenge.name}`}
        title={`Desafio - ${challenge.name}`}
        description={
          challenge.description || `Acesse o desafio ${challenge.name}`
        }
        image={challenge.image.url}
      />

      <ChallengeHeader
        isParticipate={isParticipate}
        setParticipate={() => setIsParticipate(true)}
      />

      <div className={styles.challenge}>
        <div className={styles.challenge__content}>
          <PrismicRichText field={challenge.content} />

          <h2>Protótipo do desafio</h2>

          <iframe
            allowFullScreen
            src={`https://www.figma.com/embed?embed_host=astra&url=${challenge.prototype_url}`}
          />

          <h2>Como funciona a participação</h2>

          <p>
            A sua participação só será contabilizada após o envio da solução.
            Enquanto o desafio não for encerrado você pode editar os dados do
            seu envio quantas vezes quiser.
          </p>

          <p>
            Após o encerramento do desafio será disponibilizado uma página
            contendo todas as soluções enviadas. As melhores soluções vão estar
            classificadas como solução destaque e os usuários do br challenge
            vão poder votar nelas.
          </p>

          <p>
            As soluções mais votadas de cada dificuldade vão receber os
            seguintes prêmios:
          </p>

          <ul>
            <li>1º lugar: R$ 50,00</li>
            <li>
              2º e 3º lugar: Vips no canal da twitch do{' '}
              <a
                href="https://www.twitch.tv/leovargasdev"
                target="_blank"
                rel="noreferrer"
              >
                @leovargasdev
              </a>
            </li>
          </ul>

          <p>Que os deuses do clean code estejam com você, boa sorte!</p>

          {status === 'authenticated' && (
            <Link href={`/desafio/${challenge.id}/solucao`}>
              <a
                aria-disabled={!isParticipate}
                title={
                  isParticipate
                    ? 'Clique aqui para enviar a solução'
                    : 'Vá até o topo da página e clique em participar para habilitar o botão'
                }
                className={'button '.concat(styles.button__solution)}
              >
                <HiPencilAlt />
                Enviar solução
              </a>
            </Link>
          )}
        </div>

        {challenge.authors.map(author => (
          <AuthorCard {...author} key={author.name} />
        ))}

        <p className={styles.footer__text}>
          Está com dúvidas sobre o desafio?{' '}
          <a href="https://discord.gg/JPS2bY6GVy">
            Junte-se à nossa comunidade no Discord
          </a>{' '}
          e faça perguntas no canal do desafio.
        </p>
      </div>
    </ChallengeProvider>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await collectionSlugs('/desafio', 'challenges')

  return { fallback: 'blocking', paths }
}

export const getStaticProps: GetStaticProps = async props => {
  const { params, previewData } = props

  const challengeSlug = String(params?.slug)

  const prismic = createClientPrismic({ previewData })

  const challenge = await prismic.getByUID<any>('challenges', challengeSlug)

  return {
    props: formattedChallenge(challenge),
    revalidate: CACHE_PAGE
  }
}

export default ChallengePage
