import React from 'react'
import { CardDeck, Card } from 'react-bootstrap'
import HighlightCard from './HighlightCard'

const LandingPageToolCardDeck = () => {
  const images = [
    'ansible-logo.png',
    'aws-logo.png',
    'azure-logo.png',
    'circleci-logo.png',
    'datadog-logo.png',
    'docker-logo.png',
    'gcp-logo.png',
    'github-logo.png',
    'gitlab-logo.png',
    'kubernetes-logo.png',
    'pagerduty-logo.png',
    'sendgrid-logo.png',
    'slack-logo.png',
    'terraform-logo.png',
    'twilio-logo.png',
  ];
  return (
    <div style={{ paddingBottom: '20px', background: 'black' }}>
      <center>
        <CardDeck style={{ minWidth: 900, maxWidth: 900 }}>
          { images.map(i => 
                    <HighlightCard 
                    key={i} 
                    style={{ 
                      maxWidth: '150px', 
                      minWidth: '150px', 
                      marginBottom: '30px',
                      textAlign: 'center' 
                    }}>
                <Card.Body>
                  <Card.Img variant="top" src={`/${i}`} style={{ width: '6rem' }}/>
                </Card.Body>
              </HighlightCard>
            )
          }
        </CardDeck>
      </center>
    </div>
  )
}

export default LandingPageToolCardDeck